import { COMPONENT_BY_ID } from "../data/components"
import { SIZE_COST, type Component, type Placed } from "../data/types"

/**
 * Repetition pricing.
 *
 * "Die Kosten des Effektes summieren sich aus den Komponenten und steigen bei
 * Wiederholung bereits verwendeter Komponenten." The worked examples in the
 * rules fix the escalation: the n-th copy of a component costs `n × base`.
 *
 *   3 × klein  →  1 + 2 + 3  = 6
 *   3 × mittel →  2 + 4 + 6  = 12
 *
 * Identity runs through the table cell, so `Bessere Würfel ^1` twice is a
 * repetition, while `Bessere Würfel ^1` plus `^2` is not.
 */
export const instanceCost = (component: Component, occurrence: number): number =>
  SIZE_COST[component.size] * occurrence

/**
 * Set to `true` to forbid repeating Große Komponenten. The current rule text
 * states the escalation without an exception, so repetition is allowed by
 * default; an earlier revision of the chapter did forbid it.
 */
export const GROSS_IS_REPEATABLE = true

export interface CostLine {
  uid: string
  component: Component
  /** 1 for the first use of this component, 2 for the second, and so on. */
  occurrence: number
  cost: number
}

export interface CostBreakdown {
  lines: CostLine[]
  /** The effect level: the summed cost of every placed component. */
  level: number
}

export const computeCost = (chain: Placed[]): CostBreakdown => {
  const seen = new Map<string, number>()
  const lines: CostLine[] = []

  for (const placed of chain) {
    const component = COMPONENT_BY_ID.get(placed.componentId)
    if (!component) continue
    const occurrence = (seen.get(component.id) ?? 0) + 1
    seen.set(component.id, occurrence)
    lines.push({
      uid: placed.uid,
      component,
      occurrence,
      cost: instanceCost(component, occurrence),
    })
  }

  return { lines, level: lines.reduce((sum, line) => sum + line.cost, 0) }
}

/** What adding this component to the current chain would cost right now. */
export const marginalCost = (chain: Placed[], component: Component): number => {
  const occurrence = chain.filter((p) => p.componentId === component.id).length + 1
  return instanceCost(component, occurrence)
}

/** Whether a further copy of this component may be placed at all. */
export const canRepeat = (chain: Placed[], component: Component): boolean => {
  if (GROSS_IS_REPEATABLE || component.size !== "gross") return true
  return !chain.some((p) => p.componentId === component.id)
}
