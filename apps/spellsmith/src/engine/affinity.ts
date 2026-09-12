import type { Art, Component } from "../data/types"
import { interacts, modifierFits } from "./interaction"
import type { Resolution } from "./resolve"

/**
 * Which palette components work well with what is already in the chain.
 *
 * Four signals, strongest first: a component that supplies a Bezug the chain is
 * still missing, one that would give a dangling modifier something to act on,
 * one that improves something already placed, and plain Art kinship.
 */

export type AffinityLevel = "erforderlich" | "synergie" | "verwandt" | "neutral"

export interface Affinity {
  level: AffinityLevel
  /** Short German explanation, shown as the chip's tooltip. */
  reason: string
  arten: Art[]
}

const NEUTRAL: Affinity = { level: "neutral", reason: "", arten: [] }

export const computeAffinities = (
  resolution: Resolution,
  catalogue: Component[],
): Map<string, Affinity> => {
  const result = new Map<string, Affinity>()

  if (resolution.entries.length === 0) {
    for (const component of catalogue) result.set(component.id, NEUTRAL)
    return result
  }

  const placed = resolution.entries.map((entry) => entry.component)

  const missingBezug = new Set<Art>()
  for (const entry of resolution.entries) {
    if (entry.component.requiresBezug && !entry.bezug) {
      missingBezug.add(entry.component.requiresBezug)
    }
  }

  const danglingModifiers = resolution.entries.filter(
    (entry) => entry.component.modifier && !entry.boundTo,
  )

  for (const candidate of catalogue) {
    // 1. It satisfies a Bezug the chain is currently missing.
    const satisfies = candidate.providesBezug?.filter((art) => missingBezug.has(art)) ?? []
    if (satisfies.length > 0) {
      result.set(candidate.id, {
        level: "erforderlich",
        reason: `Liefert den fehlenden Bezug (${satisfies.join(", ")}).`,
        arten: satisfies,
      })
      continue
    }

    // 2. It would give a modifier that currently dangles something to act on.
    const rescues = danglingModifiers.find((entry) => modifierFits(entry.component, candidate))
    if (rescues) {
      result.set(candidate.id, {
        level: "synergie",
        reason: `Gibt „${rescues.component.row} ${rescues.component.cell}" ein Bezugsobjekt.`,
        arten: interacts(rescues.component, candidate),
      })
      continue
    }

    // 3. It is a modifier that would improve something already in the chain.
    if (candidate.modifier) {
      const target = placed.find((component) => modifierFits(candidate, component))
      if (target) {
        result.set(candidate.id, {
          level: "synergie",
          reason: `Verbessert „${target.row}" in der Kette.`,
          arten: interacts(candidate, target),
        })
        continue
      }
    }

    // 4. Plain Art kinship across groups.
    let related: { component: Component; arten: Art[] } | undefined
    for (const component of placed) {
      const arten = interacts(candidate, component)
      if (arten.length > 0) {
        related = { component, arten }
        break
      }
    }
    if (related) {
      result.set(candidate.id, {
        level: "verwandt",
        reason: `Teilt die Art ${related.arten.join(", ")} mit „${related.component.row}".`,
        arten: related.arten,
      })
      continue
    }

    result.set(candidate.id, NEUTRAL)
  }

  return result
}
