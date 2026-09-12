import type { Art, Component } from "../data/types"

/**
 * Whether two components may interact at all.
 *
 * They must share an Art *and* sit in different groups: "Art-Interaktionen
 * geschehen typischerweise zwischen Komponenten-Gruppen, nicht innerhalb."
 * That is what keeps `Schaden` and `RW unterstützen` — both Würfel, both
 * Wirkung — from being treated as related.
 *
 * `SG erschweren` is the documented exception: its description explicitly names
 * `Zustand verursachen` as its target, and both live in the Wirkung group.
 */
export const interacts = (a: Component, b: Component): Art[] => {
  const arten = a.arten.filter((art) => b.arten.includes(art))
  if (arten.length === 0) return []
  if (a.group !== b.group) return arten
  const documentedException =
    (a.row === "SG erschweren" || b.row === "SG erschweren") && arten.includes("SG")
  return documentedException ? arten : []
}

/** Can `modifier` actually act on `target`'s value? */
export const modifierFits = (modifier: Component, target: Component): boolean => {
  if (!modifier.modifier) return false
  // Steigerung components carry no value of their own, so nothing modifies them.
  // `SG erschweren` does carry a flat value and stays a valid target.
  if (target.group === "steigerung") return false
  const arten = interacts(modifier, target)
  if (arten.length === 0) return false
  // The SG is a derived number (`10 + Effekt-Stufe - 1`), not the cell value of
  // the component that carries it, so an SG modifier attaches to a target that
  // shows no value of its own.
  if (arten.includes("SG")) return true
  switch (modifier.modifier.kind) {
    case "dieStep":
    case "diceCount":
      return target.value.kind === "dice"
    case "flat":
      return target.value.kind === "flat" || target.value.kind === "dice"
  }
}

/** Can `bezug` satisfy what `wirkung` is missing? */
export const bezugFits = (bezug: Component, wirkung: Component): boolean =>
  wirkung.requiresBezug !== undefined &&
  (bezug.providesBezug?.includes(wirkung.requiresBezug) ?? false)
