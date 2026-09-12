import { SIZE_LABEL } from "../data/types"
import type { Resolution } from "../engine/resolve"

interface EffectSummaryProps {
  resolution: Resolution
}

/**
 * The always-visible answer to "what does this spell actually do?" — resolved
 * values rather than a list of what was placed, so modifiers show up folded
 * into the component they attached to.
 */
export const EffectSummary = ({ resolution }: EffectSummaryProps) => (
  <section className="panel" aria-label="Wirkung">
    <div className="panel__head">
      <h2>Wirkung</h2>
      <span className="hint">laufend berechnet</span>
    </div>
    <div className="panel__body">
      {resolution.empty ? (
        <p className="hint">Noch keine Komponente gewählt.</p>
      ) : (
        <>
          <dl className="summary__lines">
            {resolution.lines.map((line, index) => (
              <div key={`${line.key}-${index}`} style={{ display: "contents" }}>
                <dt className="summary__key">{line.key}</dt>
                <dd className="summary__value" data-incomplete={line.incomplete ?? false}>
                  <strong>{line.value}</strong>
                  {line.note && <span className="summary__note">{line.note}</span>}
                </dd>
              </div>
            ))}
          </dl>

          {resolution.warnings.length > 0 && (
            <ul className="summary__warnings">
              {resolution.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          )}

          <div className="summary__cost">
            <table className="cost-table">
              <thead>
                <tr>
                  <th>Komponente</th>
                  <th>Größe</th>
                  <th>Stufen</th>
                </tr>
              </thead>
              <tbody>
                {resolution.cost.lines.map((line) => (
                  <tr key={line.uid}>
                    <td>
                      {line.component.row} {line.component.cell}
                      {line.occurrence > 1 && (
                        <span className="cost-table__repeat"> ×{line.occurrence}</span>
                      )}
                    </td>
                    <td>{SIZE_LABEL[line.component.size]}</td>
                    <td>{line.cost}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>Effekt-Stufe</td>
                  <td>{resolution.level}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  </section>
)
