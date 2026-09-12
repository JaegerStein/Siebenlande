/**
 * Domain model for the component magic system (Regeln/Magie/Magie.md).
 *
 * The single most important invariant of the rule tables is mirrored here:
 * **one filled table cell is exactly one component.** A row plus a size is a
 * distinct, separately-learned component, so `Bessere Würfel ^1` twice is not
 * the same thing as `Bessere Würfel ^2` and does not count as a repetition of
 * it. Every `Component` in the catalogue therefore corresponds to one cell.
 */

/** Size tier of a component. Determines its base cost in effect levels. */
export type Size = "klein" | "mittel" | "gross"

/** Base cost in effect levels per size tier. */
export const SIZE_COST: Record<Size, number> = { klein: 1, mittel: 2, gross: 3 }

export const SIZE_LABEL: Record<Size, string> = {
  klein: "Klein",
  mittel: "Mittel",
  gross: "Groß",
}

/**
 * The six component groups. Art interactions happen *between* groups, never
 * inside one — two components sharing an Art within the same group do not
 * modify each other.
 */
export type GroupId = "form" | "wirkung" | "bezug" | "handlung" | "steigerung" | "dauer"

/**
 * Art tags. Sharing an Art is what makes two components able to modify each
 * other. An empty Art list is a deliberate statement, not a gap: the component
 * belongs to no shared Art and interacts only within its own row.
 */
export type Art =
  | "Schaden"
  | "Resistenz"
  | "Attribut"
  | "Fähigkeit"
  | "Zustand"
  | "Zustände"
  | "RW"
  | "SG"
  | "Würfel"
  | "Flach"

/** The numeric payload a component carries, if any. */
export type ComponentValue =
  | { kind: "dice"; count: number; die: number }
  | { kind: "flat"; amount: number }
  | { kind: "distance"; feet: number }
  | { kind: "angle"; degrees: number }
  | { kind: "mark" }

/** How a modifier changes the base component it binds to. */
export type ModifierEffect =
  | { kind: "dieStep"; steps: number }
  | { kind: "diceCount"; amount: number }
  | { kind: "flat"; amount: number }

/** Which resolved slot of the effect a base component contributes to. */
export type Facet =
  | "reichweite"
  | "laenge"
  | "breite"
  | "radius"
  | "ziele"
  | "wirkung"
  | "handlung"
  | "bewegung"
  | "dauer"
  | "bezug"

export interface Component {
  /** Stable id, used for repetition counting. One id per table cell. */
  id: string
  /** The table row this cell sits in — the human-facing component name. */
  row: string
  group: GroupId
  size: Size
  /** What the cell itself shows, e.g. "30 Fuß", "1W4", "^2", "✓". */
  cell: string
  arten: Art[]
  description: string
  value: ComponentValue
  facet: Facet
  /** Set on the three Steigerung rows and on `SG erschweren`. */
  modifier?: ModifierEffect
  /** Wirkung components marked `*` in the rules: they need a Bezug component. */
  requiresBezug?: Art
  /** Bezug components: which Art they can satisfy. */
  providesBezug?: Art[]
  /** `**` in the rules: unaffected by the Abbauend component. */
  ignoresAbbauend?: boolean
  /** Components whose concrete pick is open (a skill, a condition). */
  freeText?: string
  /** Sub-heading a Bezug cell sits under, for palette grouping. */
  section?: string
}

export interface GroupMeta {
  id: GroupId
  label: string
  description: string
}

export const GROUPS: GroupMeta[] = [
  {
    id: "form",
    label: "Form",
    description: "In welcher Fläche und auf welche Ziele der Effekt wirkt.",
  },
  {
    id: "wirkung",
    label: "Wirkung",
    description: "Die primären Komponenten des Effektes. Viele brauchen einen Bezug.",
  },
  {
    id: "bezug",
    label: "Bezug",
    description: "Legt fest, worauf sich eine Wirkung bezieht.",
  },
  {
    id: "handlung",
    label: "Handlung",
    description: "Gibt dem Ziel zusätzliche Handlungsmöglichkeiten.",
  },
  {
    id: "steigerung",
    label: "Steigerung",
    description: "Verbessert andere Komponenten, wirkt alleinstehend nicht.",
  },
  {
    id: "dauer",
    label: "Dauer",
    description: "Erhält den Effekt über einen Zeitraum aufrecht.",
  },
]

/** A component placed in the chain. Order is meaningful. */
export interface Placed {
  /** Unique per placement, so the same component can sit in the chain twice. */
  uid: string
  componentId: string
  /** User-supplied name for open-ended components (skill, condition). */
  label?: string
}
