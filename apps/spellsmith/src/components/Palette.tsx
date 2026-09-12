import { Fragment } from "react"
import { ROWS_BY_GROUP } from "../data/components"
import { GROUPS, SIZE_LABEL, type Component, type Placed } from "../data/types"
import type { Affinity } from "../engine/affinity"
import { marginalCost, canRepeat } from "../engine/cost"
import type { DragSource } from "../hooks/useDrag"

interface PaletteProps {
  chain: Placed[]
  affinities: Map<string, Affinity>
  anySelected: boolean
  onAdd: (componentId: string) => void
  onBeginDrag: (
    source: DragSource,
    label: string,
    detail: string,
    size: Component["size"],
    event: React.PointerEvent,
  ) => void
}

export const Palette = ({ chain, affinities, anySelected, onAdd, onBeginDrag }: PaletteProps) => (
  <section className="panel" aria-label="Komponenten">
    <div className="panel__head">
      <h2>Komponenten</h2>
      <span className="hint">Ziehen oder anklicken</span>
    </div>
    <div className="panel__body">
      <Legend />
      {GROUPS.map((group) => {
        const rows = ROWS_BY_GROUP.get(group.id) ?? []
        let lastSection: string | undefined
        return (
          <div className="palette__group" key={group.id}>
            <div className="palette__group-head">
              <h3>{group.label}</h3>
              <p>{group.description}</p>
            </div>
            {rows.map((cells) => {
              const first = cells[0]
              if (!first) return null
              const section = first.section
              const sectionHead = section && section !== lastSection ? section : null
              lastSection = section
              return (
                <Fragment key={`${section ?? ""}-${first.row}`}>
                  {sectionHead && <div className="palette__section">{sectionHead}</div>}
                  <div className="palette__row">
                    <div className="palette__row-label">{first.row}</div>
                    <div className="palette__cells">
                      {cells.map((component) => (
                        <Chip
                          key={component.id}
                          component={component}
                          chain={chain}
                          affinity={affinities.get(component.id)}
                          anySelected={anySelected}
                          onAdd={onAdd}
                          onBeginDrag={onBeginDrag}
                        />
                      ))}
                    </div>
                  </div>
                </Fragment>
              )
            })}
          </div>
        )
      })}
    </div>
  </section>
)

interface ChipProps {
  component: Component
  chain: Placed[]
  affinity: Affinity | undefined
  anySelected: boolean
  onAdd: (componentId: string) => void
  onBeginDrag: PaletteProps["onBeginDrag"]
}

const Chip = ({ component, chain, affinity, anySelected, onAdd, onBeginDrag }: ChipProps) => {
  const cost = marginalCost(chain, component)
  const used = chain.filter((placed) => placed.componentId === component.id).length
  const repeatable = canRepeat(chain, component)
  const level = affinity?.level ?? "neutral"
  const arten = component.arten.length > 0 ? component.arten.join(", ") : "keine geteilte Art"

  const title = [
    `${component.row} — ${SIZE_LABEL[component.size]}`,
    component.description,
    `Art: ${arten}`,
    used > 0 ? `Nächste Wiederholung kostet ${cost} Stufen.` : `Kostet ${cost} Stufen.`,
    affinity?.reason,
  ]
    .filter(Boolean)
    .join("\n")

  return (
    <button
      type="button"
      className="chip"
      data-size={component.size}
      data-affinity={level}
      data-dimmed={anySelected && level === "neutral"}
      disabled={!repeatable}
      title={title}
      onPointerDown={(event) =>
        onBeginDrag(
          { kind: "palette", componentId: component.id },
          component.row,
          component.cell,
          component.size,
          event,
        )
      }
      onClick={() => onAdd(component.id)}
    >
      <span className="chip__value">{component.cell}</span>
      <span className="chip__cost">{cost}</span>
      {used > 0 && <span className="chip__repeat">×{used}</span>}
    </button>
  )
}

const Legend = () => (
  <div className="legend" style={{ marginBottom: "0.7rem" }}>
    <span className="legend__item">
      <i className="legend__swatch" data-kind="klein" /> Klein · 1
    </span>
    <span className="legend__item">
      <i className="legend__swatch" data-kind="mittel" /> Mittel · 2
    </span>
    <span className="legend__item">
      <i className="legend__swatch" data-kind="gross" /> Groß · 3
    </span>
    <span className="legend__item">
      <i className="legend__swatch" data-kind="erforderlich" /> fehlender Bezug
    </span>
    <span className="legend__item">
      <i className="legend__swatch" data-kind="synergie" /> passt zur Auswahl
    </span>
  </div>
)
