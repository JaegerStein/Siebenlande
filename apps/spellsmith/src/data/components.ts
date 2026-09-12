import type { Art, Component, Size } from "./types"

/**
 * The component catalogue, transcribed cell by cell from
 * `Siebenlande/Regeln/Magie/Magie.md`.
 *
 * Every filled cell of the rule tables becomes exactly one entry here. Rows that
 * offer several sizes therefore appear several times, each with its own id —
 * that is what makes repetition counting match the rules.
 */

/**
 * Ids are derived from the row name and size rather than counted, so that a
 * shared link keeps working when the catalogue is reordered or extended.
 */
const slug = (row: string) =>
  row
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const idFor = (row: string, size: Size) => `${slug(row)}.${size}`

type CellSpec = Partial<Record<Size, Component["value"] | "mark">>

interface RowSpec {
  row: string
  group: Component["group"]
  arten?: Art[]
  description: string
  facet: Component["facet"]
  cells: CellSpec
  /** Label shown on the chip, per size. Defaults to a rendering of the value. */
  cellLabel?: Partial<Record<Size, string>>
  modifier?: Partial<Record<Size, Component["modifier"]>>
  requiresBezug?: Art
  providesBezug?: Art[]
  ignoresAbbauend?: boolean
  freeText?: string
  section?: string
}

const renderValue = (value: Component["value"]): string => {
  switch (value.kind) {
    case "dice":
      return `${value.count}W${value.die}`
    case "flat":
      return value.amount >= 0 ? `+${value.amount}` : `${value.amount}`
    case "distance":
      return `${value.feet} Fuß`
    case "angle":
      return `${value.degrees}°`
    case "mark":
      return "✓"
  }
}

const SIZES: Size[] = ["klein", "mittel", "gross"]

const expand = (spec: RowSpec): Component[] =>
  SIZES.flatMap((size) => {
    const cell = spec.cells[size]
    if (!cell) return []
    const value: Component["value"] = cell === "mark" ? { kind: "mark" } : cell
    const modifier = spec.modifier?.[size]
    const component: Component = {
      id: idFor(spec.row, size),
      row: spec.row,
      group: spec.group,
      size,
      cell: spec.cellLabel?.[size] ?? renderValue(value),
      arten: spec.arten ?? [],
      description: spec.description,
      value,
      facet: spec.facet,
      ...(modifier ? { modifier } : {}),
      ...(spec.requiresBezug ? { requiresBezug: spec.requiresBezug } : {}),
      ...(spec.providesBezug ? { providesBezug: spec.providesBezug } : {}),
      ...(spec.ignoresAbbauend ? { ignoresAbbauend: true } : {}),
      ...(spec.freeText ? { freeText: spec.freeText } : {}),
      ...(spec.section ? { section: spec.section } : {}),
    }
    return [component]
  })

const dice = (count: number, die: number): Component["value"] => ({ kind: "dice", count, die })
const flat = (amount: number): Component["value"] => ({ kind: "flat", amount })
const feet = (f: number): Component["value"] => ({ kind: "distance", feet: f })
const deg = (degrees: number): Component["value"] => ({ kind: "angle", degrees })

// --- Form ------------------------------------------------------------------

const FORM: RowSpec[] = [
  {
    row: "Reichweite",
    group: "form",
    facet: "reichweite",
    description: "Wirkt den Effekt an einem Punkt innerhalb der Reichweite.",
    cells: { klein: feet(30), mittel: feet(60), gross: feet(90) },
  },
  {
    row: "Länge",
    group: "form",
    facet: "laenge",
    description:
      "Wirkt den Effekt auf allen Feldern über die Länge. Hat der Effekt keine Breite, ist die Breite der Länge 1 Feld.",
    cells: { klein: feet(15), mittel: feet(30), gross: feet(45) },
  },
  {
    row: "Breite",
    group: "form",
    facet: "breite",
    description:
      "Wirkt den Effekt in einer Kegelfläche dieses Winkels. Hat der Effekt keine Länge, ist der Kegel nur 1 Feld tief.",
    cells: { klein: deg(45), mittel: deg(90), gross: deg(135) },
  },
  {
    row: "Radius",
    group: "form",
    facet: "radius",
    description: "Wirkt den Effekt in dem Radius um ein Feld.",
    cells: { mittel: feet(5), gross: feet(10) },
  },
  {
    row: "Ziele",
    group: "form",
    arten: ["Flach"],
    facet: "ziele",
    description: "Wirkt den Effekt auf ein weiteres Ziel.",
    cells: { gross: flat(1) },
    cellLabel: { gross: "+1 Ziel" },
  },
]

// --- Wirkung ---------------------------------------------------------------

const WIRKUNG: RowSpec[] = [
  {
    row: "Schaden",
    group: "wirkung",
    arten: ["Schaden", "Würfel", "Flach"],
    facet: "wirkung",
    description: "Verursacht 1W4 Schaden am Ziel.",
    cells: { mittel: dice(1, 4) },
    requiresBezug: "Schaden",
  },
  {
    row: "Ausdauer (heilen)",
    group: "wirkung",
    arten: ["Würfel", "Flach"],
    facet: "wirkung",
    description: "Heilt das Ziel um 1W4 Ausdauer.",
    cells: { mittel: dice(1, 4) },
    ignoresAbbauend: true,
  },
  {
    row: "Ausdauer (temporär)",
    group: "wirkung",
    arten: ["Würfel", "Flach"],
    facet: "wirkung",
    description: "Gibt dem Ziel 1W4 temporäre Ausdauer.",
    cells: { klein: dice(1, 4) },
    ignoresAbbauend: true,
  },
  {
    row: "Attributsbonus",
    group: "wirkung",
    arten: ["Attribut", "Flach"],
    facet: "wirkung",
    description: "Gibt dem Ziel Bonus auf einen Attributswurf.",
    cells: { mittel: flat(1), gross: flat(2) },
    requiresBezug: "Attribut",
  },
  {
    row: "Resistenz",
    group: "wirkung",
    arten: ["Resistenz", "Flach"],
    facet: "wirkung",
    description: "Gibt dem Ziel Resistenz.",
    cells: { mittel: flat(2), gross: flat(3) },
    requiresBezug: "Resistenz",
  },
  {
    row: "RW unterstützen",
    group: "wirkung",
    arten: ["RW", "Würfel", "Flach"],
    facet: "wirkung",
    description: "Gibt dem Ziel einen Bonus auf einen Rettungswurf.",
    cells: { mittel: dice(1, 4) },
    requiresBezug: "RW",
  },
  {
    row: "Fähigkeitswurf",
    group: "wirkung",
    arten: ["Fähigkeit", "Würfel", "Flach"],
    facet: "wirkung",
    description: "Gibt dem Ziel einen Bonus auf einen Fähigkeitswurf.",
    cells: { mittel: dice(1, 4) },
    requiresBezug: "Fähigkeit",
  },
  {
    row: "Zustand verursachen",
    group: "wirkung",
    arten: ["Zustand", "SG"],
    facet: "wirkung",
    description:
      "Löst einen Zustand beim Ziel aus. Dem Zustand kann mittels eines RW widerstanden werden. Das RW-Attribut wird vom Wirkenden gewählt und erfordert keinen Bezug. Der RW beträgt initial 10 + Effekt-Stufe - 1.",
    cells: { klein: "mark" },
    requiresBezug: "Zustand",
  },
  {
    row: "Zustand aufheben",
    group: "wirkung",
    arten: ["Zustand", "Zustände", "SG"],
    facet: "wirkung",
    description:
      "Befreit das Ziel von Zuständen. Entspricht die Effekt-Stufe + 10 dem RW, wird das Ziel automatisch befreit. Liegt die Effekt-Stufe darunter, darf das Ziel den RW erneut versuchen - der neue RW-Wert beträgt Original-RW - Effekt-Stufe.",
    cells: { mittel: "mark" },
    requiresBezug: "Zustand",
  },
  {
    row: "SG erschweren",
    group: "wirkung",
    arten: ["SG", "Flach"],
    facet: "wirkung",
    description: "Erhöht den SG des Zustand-verursachen-RW.",
    cells: { klein: flat(1), mittel: flat(2), gross: flat(3) },
    modifier: {
      klein: { kind: "flat", amount: 1 },
      mittel: { kind: "flat", amount: 2 },
      gross: { kind: "flat", amount: 3 },
    },
  },
  {
    row: "Vorteil",
    group: "wirkung",
    facet: "wirkung",
    description: "Gibt dem Ziel Vorteil auf einen W20-Wurf.",
    cells: { gross: "mark" },
  },
  {
    row: "Nachteil",
    group: "wirkung",
    facet: "wirkung",
    description: "Gibt dem Ziel Nachteil auf einen W20-Wurf.",
    cells: { gross: "mark" },
  },
]

// --- Bezug -----------------------------------------------------------------

const attribut = (name: string): RowSpec => ({
  row: name,
  group: "bezug",
  arten: ["Attribut", "RW"],
  facet: "bezug",
  section: "Attribut",
  description: `Legt ${name} als Attribut des Attributs- oder Rettungswurf-Bonus fest.`,
  cells: { klein: "mark" },
  providesBezug: ["Attribut", "RW"],
  cellLabel: { klein: name },
})

const schadensart = (name: string, size: Size, covers?: string): RowSpec => ({
  row: name,
  group: "bezug",
  arten: ["Schaden", "Resistenz"],
  facet: "bezug",
  section: "Schadensart",
  description: covers ?? `Legt ${name} als Schadensart fest.`,
  cells: { [size]: "mark" },
  providesBezug: ["Schaden", "Resistenz"],
  cellLabel: { [size]: name },
})

const BEZUG: RowSpec[] = [
  attribut("Stärke"),
  attribut("Athletik"),
  attribut("Geschick"),
  attribut("Konstitution"),
  attribut("Wahrnehmung"),
  attribut("Intelligenz"),
  attribut("Weisheit"),
  attribut("Charisma"),
  {
    row: "Fähigkeit",
    group: "bezug",
    arten: ["Fähigkeit"],
    facet: "bezug",
    section: "Fähigkeit",
    description:
      "Legt die Fähigkeit für den Bonus auf den Fähigkeitswurf fest. Jede Fähigkeit ist eine eigenständige Komponente.",
    cells: { klein: "mark" },
    providesBezug: ["Fähigkeit"],
    cellLabel: { klein: "Fähigkeit" },
    freeText: "Welche Fähigkeit?",
  },
  schadensart("Physisch", "gross", "Legt alle physischen Schadensarten fest."),
  schadensart("Wucht", "klein"),
  schadensart("Schnitt", "klein"),
  schadensart("Stich", "klein"),
  schadensart("Elementar", "gross", "Legt alle elementaren Schadensarten fest."),
  schadensart("Eis", "klein"),
  schadensart("Feuer", "klein"),
  schadensart("Blitz", "klein"),
  schadensart("Verschleiß", "gross", "Legt alle verschleißenden Schadensarten fest."),
  schadensart("Säure", "klein"),
  schadensart("Gift", "klein"),
  schadensart("Nekrotisch", "klein"),
  schadensart("Durchdringend", "mittel", "Legt alle durchdringenden Schadensarten fest."),
  schadensart("Macht", "klein"),
  schadensart("Schall", "klein"),
  schadensart("Mystisch", "mittel", "Legt alle mystischen Schadensarten fest."),
  schadensart("Mental", "klein"),
  schadensart("Gleißend", "klein"),
  {
    row: "Alle Zustände",
    group: "bezug",
    arten: ["Zustände"],
    facet: "bezug",
    section: "Zustand",
    description: "Legt sämtliche Zustände fest.",
    cells: { gross: "mark" },
    providesBezug: ["Zustände", "Zustand"],
    cellLabel: { gross: "Alle Zustände" },
  },
  {
    row: "Zustand",
    group: "bezug",
    arten: ["Zustand"],
    facet: "bezug",
    section: "Zustand",
    description:
      "Legt einen individuellen Zustand fest. Jeder Zustand ist eine eigenständige Komponente.",
    cells: { klein: "mark" },
    providesBezug: ["Zustand"],
    cellLabel: { klein: "Zustand" },
    freeText: "Welcher Zustand?",
  },
]

// --- Handlung --------------------------------------------------------------

const HANDLUNG: RowSpec[] = [
  {
    row: "Bewegung",
    group: "handlung",
    facet: "bewegung",
    description: "Gibt dem Ziel zusätzliche Bewegung.",
    cells: { klein: feet(15), mittel: feet(30), gross: feet(45) },
  },
  {
    row: "Reaktion",
    group: "handlung",
    facet: "handlung",
    description: "Gibt dem Ziel eine zusätzliche Reaktion.",
    cells: { mittel: "mark" },
  },
  {
    row: "Bonusaktion",
    group: "handlung",
    facet: "handlung",
    description: "Gibt dem Ziel eine zusätzliche Bonusaktion.",
    cells: { mittel: "mark" },
  },
  {
    row: "Aktion",
    group: "handlung",
    facet: "handlung",
    description: "Gibt dem Ziel eine zusätzliche Aktion.",
    cells: { gross: "mark" },
  },
]

// --- Steigerung ------------------------------------------------------------

const STEIGERUNG: RowSpec[] = [
  {
    row: "Bessere Würfel",
    group: "steigerung",
    arten: ["Würfel"],
    facet: "wirkung",
    description: "Verbessert den Würfel um die angegebenen Grade (W4 → W6 → W8 → W10 → W12 → W20).",
    cells: { klein: flat(1), mittel: flat(2), gross: flat(3) },
    cellLabel: { klein: "^1", mittel: "^2", gross: "^3" },
    modifier: {
      klein: { kind: "dieStep", steps: 1 },
      mittel: { kind: "dieStep", steps: 2 },
      gross: { kind: "dieStep", steps: 3 },
    },
  },
  {
    row: "Mehr Würfel",
    group: "steigerung",
    arten: ["Würfel"],
    facet: "wirkung",
    description: "Erhöht die Anzahl der Würfel.",
    cells: { klein: flat(1), mittel: flat(2), gross: flat(3) },
    modifier: {
      klein: { kind: "diceCount", amount: 1 },
      mittel: { kind: "diceCount", amount: 2 },
      gross: { kind: "diceCount", amount: 3 },
    },
  },
  {
    row: "Flacher Wert",
    group: "steigerung",
    arten: ["Flach"],
    facet: "wirkung",
    description: "Verbessert einen flachen Wert.",
    cells: { klein: flat(1), mittel: flat(2), gross: flat(3) },
    modifier: {
      klein: { kind: "flat", amount: 1 },
      mittel: { kind: "flat", amount: 2 },
      gross: { kind: "flat", amount: 3 },
    },
  },
]

// --- Dauer -----------------------------------------------------------------

const DAUER: RowSpec[] = [
  {
    row: "Konzentration",
    group: "dauer",
    facet: "dauer",
    description: "Erlaubt es, den Effekt mittels Konzentration aufrecht zu erhalten.",
    cells: { klein: "mark" },
  },
  {
    row: "Runden",
    group: "dauer",
    arten: ["Flach"],
    facet: "dauer",
    description: "Erhält den Effekt nach dem Wirken automatisch eine Runde aufrecht.",
    cells: { gross: flat(1) },
  },
  {
    row: "Abbauend",
    group: "dauer",
    facet: "dauer",
    description:
      "Effekte mit Zahlwert verfallen erst, wenn sie verbraucht werden, und bleiben ansonsten auf unbestimmte Zeit aktiv.",
    cells: { gross: "mark" },
  },
]

export const COMPONENTS: Component[] = [
  ...FORM,
  ...WIRKUNG,
  ...BEZUG,
  ...HANDLUNG,
  ...STEIGERUNG,
  ...DAUER,
].flatMap(expand)

export const COMPONENT_BY_ID = new Map(COMPONENTS.map((c) => [c.id, c]))

const IS_DEV = typeof import.meta.env !== "undefined" && import.meta.env.DEV

if (IS_DEV && COMPONENT_BY_ID.size !== COMPONENTS.length) {
  const counts = new Map<string, number>()
  for (const c of COMPONENTS) counts.set(c.id, (counts.get(c.id) ?? 0) + 1)
  const clashes = [...counts].filter(([, n]) => n > 1).map(([id]) => id)
  throw new Error(`Doppelte Komponenten-Ids im Katalog: ${clashes.join(", ")}`)
}

/**
 * Catalogue rows regrouped for the palette: one entry per table row, holding
 * that row's filled cells. This is what lets the palette render as the rule
 * tables do — row label on the left, one chip per available size.
 */
export const ROWS_BY_GROUP = COMPONENTS.reduce<Map<string, Component[][]>>((acc, component) => {
  const rows = acc.get(component.group) ?? []
  const last = rows.at(-1)
  if (last && last[0]?.row === component.row && last[0]?.section === component.section) {
    last.push(component)
  } else {
    rows.push([component])
  }
  acc.set(component.group, rows)
  return acc
}, new Map())

/** Die progression used by the `Bessere Würfel` component. */
export const DIE_LADDER = [4, 6, 8, 10, 12, 20] as const
