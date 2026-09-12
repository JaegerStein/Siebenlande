import { Fragment } from "react"
import { SIZE_LABEL, type Placed, type Size } from "../data/types"
import type { Resolution } from "../engine/resolve"
import type { DragSource, DragState } from "../hooks/useDrag"

interface ChainProps {
  chain: Placed[]
  resolution: Resolution
  drag: DragState | null
  dropIndex: number | null
  setZone: (element: HTMLElement | null) => void
  onRemove: (uid: string) => void
  onLabel: (uid: string, label: string) => void
  onMove: (uid: string, delta: number) => void
  onClear: () => void
  onBeginDrag: (
    source: DragSource,
    label: string,
    detail: string,
    size: Size,
    event: React.PointerEvent,
  ) => void
}

export const Chain = ({
  chain,
  resolution,
  drag,
  dropIndex,
  setZone,
  onRemove,
  onLabel,
  onMove,
  onClear,
  onBeginDrag,
}: ChainProps) => {
  const dragUid = drag?.source.kind === "chain" ? drag.source.uid : null

  return (
    <section className="panel" aria-label="Komponenten-Kette">
      <div className="panel__head">
        <h2>Kette</h2>
        <span className="hint">Reihenfolge zählt: Steigerungen wirken nach links</span>
      </div>
      <div className="panel__body">
        <div className="chain" ref={setZone} data-drop-active={drag !== null && dropIndex !== null}>
          {chain.length === 0 && drag === null && (
            <p className="chain__empty">
              Komponenten hierher ziehen oder links anklicken. Der Effekt und seine Stufe werden
              laufend berechnet.
            </p>
          )}
          {resolution.entries.map((entry, index) => (
            <Fragment key={entry.uid}>
              {dropIndex === index && <span className="chain__marker" />}
              <article
                data-chain-item
                className="slot"
                data-size={entry.component.size}
                data-dragged={dragUid === entry.uid}
                data-state={
                  entry.warnings.length > 0
                    ? "warn"
                    : entry.component.modifier
                      ? "modifier"
                      : undefined
                }
                title={`${entry.component.row} — ${SIZE_LABEL[entry.component.size]}\n${entry.component.description}`}
                onPointerDown={(event) => {
                  if ((event.target as HTMLElement).closest("button, input")) return
                  onBeginDrag(
                    { kind: "chain", uid: entry.uid, index },
                    entry.component.row,
                    entry.component.cell,
                    entry.component.size,
                    event,
                  )
                }}
              >
                <button
                  type="button"
                  className="slot__remove"
                  aria-label={`${entry.component.row} entfernen`}
                  onClick={() => onRemove(entry.uid)}
                >
                  ×
                </button>
                <div className="slot__top">
                  <span className="slot__name">{entry.component.row}</span>
                  <span className="slot__value">{entry.component.cell}</span>
                </div>
                <div className="slot__meta">
                  <span>{resolution.cost.lines[index]?.cost ?? 0} St.</span>
                  {(resolution.cost.lines[index]?.occurrence ?? 1) > 1 && (
                    <span>×{resolution.cost.lines[index]?.occurrence}</span>
                  )}
                  {entry.boundToIndex !== undefined && (
                    <span className="slot__bind">
                      → {resolution.entries[entry.boundToIndex]?.component.row}
                    </span>
                  )}
                  {entry.bezug && (
                    <span className="slot__bind">
                      · {entry.bezug.label ?? entry.bezug.component.cell}
                    </span>
                  )}
                  {entry.warnings.length > 0 && <span className="slot__warn">!</span>}
                </div>
                {entry.component.freeText && (
                  <input
                    className="slot__label-input"
                    value={entry.label ?? ""}
                    placeholder={entry.component.freeText}
                    onChange={(event) => onLabel(entry.uid, event.target.value)}
                  />
                )}
                <div className="slot__meta">
                  <button
                    type="button"
                    className="slot__nudge"
                    aria-label="nach links"
                    onClick={() => onMove(entry.uid, -1)}
                    disabled={index === 0}
                    style={nudgeStyle}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="slot__nudge"
                    aria-label="nach rechts"
                    onClick={() => onMove(entry.uid, 1)}
                    disabled={index === chain.length - 1}
                    style={nudgeStyle}
                  >
                    ›
                  </button>
                </div>
              </article>
            </Fragment>
          ))}
          {dropIndex === resolution.entries.length && <span className="chain__marker" />}
        </div>
        <div className="chain__actions">
          <button type="button" className="button" onClick={onClear} disabled={chain.length === 0}>
            Kette leeren
          </button>
          <span className="hint" style={{ alignSelf: "center" }}>
            Zum Entfernen aus der Kette heraus ziehen.
          </span>
        </div>
      </div>
    </section>
  )
}

const nudgeStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 4,
  background: "transparent",
  lineHeight: 1,
  padding: "0 0.3rem",
  fontSize: "0.8rem",
}
