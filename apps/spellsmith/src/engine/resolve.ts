import { COMPONENT_BY_ID, DIE_LADDER } from "../data/components"
import type { Component, Placed } from "../data/types"
import { computeCost, type CostBreakdown } from "./cost"
import { bezugFits, modifierFits } from "./interaction"

/**
 * Turns an ordered chain of components into the effect it actually produces.
 *
 * The chain order carries meaning: a modifier binds backwards onto the nearest
 * preceding component it can act on. `1W4 Schaden · Feuer · Mehr Würfel +1`
 * therefore reads as 2W4 fire damage, and putting a second Wirkung between them
 * changes what the modifier attaches to.
 */

export interface ResolvedValue {
  count: number
  die: number
  flat: number
  /** Whether the component has any numeric payload at all. */
  numeric: boolean
}

export interface ResolvedEntry {
  uid: string
  component: Component
  /** For modifiers: uid of the component it attached to. */
  boundTo?: string
  /** For modifiers: how far back it had to reach, for the connector line. */
  boundToIndex?: number
  /** For Wirkung components: the Bezug entry that satisfies them. */
  bezug?: ResolvedEntry
  /** Modifier uids that attached to this entry. */
  modifiers: string[]
  value: ResolvedValue
  label?: string
  warnings: string[]
}

export interface EffectLine {
  /** Short heading, e.g. "Schaden". */
  key: string
  /** Resolved value, e.g. "2W6+2 Feuer". */
  value: string
  /** Optional qualifier shown dimmed. */
  note?: string
  incomplete?: boolean
}

export interface Resolution {
  entries: ResolvedEntry[]
  cost: CostBreakdown
  level: number
  lines: EffectLine[]
  warnings: string[]
  /** True when nothing has been placed yet. */
  empty: boolean
}

const upgradeDie = (die: number, steps: number): number => {
  const index = DIE_LADDER.indexOf(die as (typeof DIE_LADDER)[number])
  if (index < 0) return die
  return DIE_LADDER[Math.min(index + steps, DIE_LADDER.length - 1)] ?? die
}

const baseValue = (component: Component): ResolvedValue => {
  switch (component.value.kind) {
    case "dice":
      return { count: component.value.count, die: component.value.die, flat: 0, numeric: true }
    case "flat":
      return { count: 0, die: 0, flat: component.value.amount, numeric: true }
    case "distance":
      return { count: 0, die: 0, flat: component.value.feet, numeric: true }
    case "angle":
      return { count: 0, die: 0, flat: component.value.degrees, numeric: true }
    case "mark":
      return { count: 0, die: 0, flat: 0, numeric: false }
  }
}

const formatDice = (value: ResolvedValue): string => {
  if (value.count > 0) {
    const flat = value.flat > 0 ? `+${value.flat}` : value.flat < 0 ? `${value.flat}` : ""
    return `${value.count}W${value.die}${flat}`
  }
  return value.flat >= 0 ? `+${value.flat}` : `${value.flat}`
}

export const resolve = (chain: Placed[]): Resolution => {
  const cost = computeCost(chain)

  const entries: ResolvedEntry[] = []
  for (const placed of chain) {
    const component = COMPONENT_BY_ID.get(placed.componentId)
    if (!component) continue
    entries.push({
      uid: placed.uid,
      component,
      modifiers: [],
      value: baseValue(component),
      ...(placed.label ? { label: placed.label } : {}),
      warnings: [],
    })
  }

  // --- bind modifiers backwards ---------------------------------------------
  entries.forEach((entry, index) => {
    if (!entry.component.modifier) return
    for (let j = index - 1; j >= 0; j--) {
      const target = entries[j]
      if (!target) continue
      if (modifierFits(entry.component, target.component)) {
        entry.boundTo = target.uid
        entry.boundToIndex = j
        target.modifiers.push(entry.uid)
        return
      }
    }
    entry.warnings.push("Findet kein Bezugsobjekt davor und bleibt wirkungslos.")
  })

  // --- bind Bezug components ------------------------------------------------
  const takenBezug = new Set<string>()
  for (const entry of entries) {
    if (!entry.component.requiresBezug) continue
    const candidate = entries.find(
      (other) =>
        !takenBezug.has(other.uid) &&
        other.component.group === "bezug" &&
        bezugFits(other.component, entry.component),
    )
    if (candidate) {
      entry.bezug = candidate
      takenBezug.add(candidate.uid)
    } else {
      entry.warnings.push(`Braucht eine Bezugs-Komponente (${entry.component.requiresBezug}).`)
    }
  }
  for (const entry of entries) {
    if (entry.component.group !== "bezug") continue
    if (!takenBezug.has(entry.uid)) {
      entry.warnings.push("Ist an keine Wirkung gebunden und bleibt wirkungslos.")
    }
  }

  // --- apply modifiers ------------------------------------------------------
  for (const entry of entries) {
    for (const uid of entry.modifiers) {
      const modifier = entries.find((candidate) => candidate.uid === uid)?.component.modifier
      if (!modifier) continue
      switch (modifier.kind) {
        case "dieStep":
          entry.value.die = upgradeDie(entry.value.die, modifier.steps)
          break
        case "diceCount":
          entry.value.count += modifier.amount
          break
        case "flat":
          entry.value.flat += modifier.amount
          break
      }
    }
  }

  const level = cost.level
  const lines = buildLines(entries, level)
  const warnings = entries.flatMap((entry) =>
    entry.warnings.map((warning) => `${entry.component.row} ${entry.component.cell}: ${warning}`),
  )

  return { entries, cost, level, lines, warnings, empty: entries.length === 0 }
}

const sumFacet = (entries: ResolvedEntry[], facet: Component["facet"]): number =>
  entries
    .filter((entry) => entry.component.facet === facet)
    .reduce((sum, entry) => sum + entry.value.flat, 0)

const buildLines = (entries: ResolvedEntry[], level: number): EffectLine[] => {
  const lines: EffectLine[] = []
  const has = (facet: Component["facet"]) =>
    entries.some((entry) => entry.component.facet === facet)

  // Reichweite, Länge, Breite, Radius and Bewegung stack across components.
  const reichweite = sumFacet(entries, "reichweite")
  const laenge = sumFacet(entries, "laenge")
  const breite = sumFacet(entries, "breite")
  const radius = sumFacet(entries, "radius")
  const bewegung = sumFacet(entries, "bewegung")

  lines.push({
    key: "Reichweite",
    value: reichweite > 0 ? `${reichweite} Fuß` : "Berührung",
    ...(reichweite > 0 ? {} : { note: "keine Reichweiten-Komponente" }),
  })

  if (has("laenge") || has("breite")) {
    const parts: string[] = []
    if (laenge > 0) parts.push(`${laenge} Fuß lang`)
    else parts.push("1 Feld tief")
    if (breite > 0) parts.push(`${breite}° Kegel`)
    else parts.push("1 Feld breit")
    lines.push({ key: "Fläche", value: parts.join(", ") })
  }
  if (radius > 0) lines.push({ key: "Radius", value: `${radius} Fuß` })

  const zusaetzlicheZiele = sumFacet(entries, "ziele")
  lines.push({
    key: "Ziele",
    value: `${1 + zusaetzlicheZiele}`,
    ...(zusaetzlicheZiele > 0 ? { note: `1 + ${zusaetzlicheZiele}` } : {}),
  })

  for (const entry of entries) {
    if (entry.component.group !== "wirkung") continue
    if (entry.component.modifier) continue // SG erschweren is folded into its target
    const bezug = entry.bezug
    const bezugLabel = bezug ? (bezug.label ?? bezug.component.cell) : undefined
    const row = entry.component.row

    if (row === "Zustand verursachen" || row === "Zustand aufheben") {
      const sgBonus = entry.modifiers.length > 0 ? entry.value.flat : 0
      const rw = row === "Zustand verursachen" ? 10 + level - 1 + sgBonus : undefined
      lines.push({
        key: row,
        value: bezugLabel ?? "—",
        ...(rw !== undefined
          ? { note: `RW ${rw} (10 + ${level} - 1${sgBonus ? ` + ${sgBonus}` : ""})` }
          : { note: `hebt auf, wenn RW ≤ ${level + 10}` }),
        ...(bezugLabel ? {} : { incomplete: true }),
      })
      continue
    }

    const needsBezug = entry.component.requiresBezug !== undefined
    lines.push({
      key: row,
      value: entry.value.numeric ? formatDice(entry.value) : "✓",
      ...(bezugLabel ? { note: bezugLabel } : needsBezug ? { note: "Bezug fehlt" } : {}),
      ...(needsBezug && !bezugLabel ? { incomplete: true } : {}),
    })
  }

  const handlungen = entries.filter((entry) => entry.component.facet === "handlung")
  if (handlungen.length > 0) {
    lines.push({
      key: "Handlung",
      value: handlungen.map((entry) => entry.component.row).join(", "),
    })
  }
  if (bewegung > 0) lines.push({ key: "Bewegung", value: `${bewegung} Fuß` })

  // Duration: one round by default; the Runden component extends it.
  const runden = entries.filter((entry) => entry.component.row === "Runden")
  const konzentration = entries.some((entry) => entry.component.row === "Konzentration")
  const abbauend = entries.some((entry) => entry.component.row === "Abbauend")
  const rundenTotal = runden.reduce((sum, entry) => sum + entry.value.flat, 0)

  const dauerParts: string[] = []
  dauerParts.push(rundenTotal > 0 ? `${rundenTotal + 1} Runden` : "1 Runde")
  if (konzentration) dauerParts.push("per Konzentration verlängerbar")
  if (abbauend) dauerParts.push("abbauend: Zahlwerte halten, bis sie verbraucht sind")
  lines.push({
    key: "Dauer",
    value: dauerParts[0] ?? "1 Runde",
    ...(dauerParts.length > 1 ? { note: dauerParts.slice(1).join(" · ") } : {}),
  })

  return lines
}
