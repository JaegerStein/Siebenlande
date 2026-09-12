import { useCallback, useEffect, useMemo, useState } from "react"
import { Chain } from "./components/Chain"
import { EffectSummary } from "./components/EffectSummary"
import { Palette } from "./components/Palette"
import { COMPONENTS, COMPONENT_BY_ID } from "./data/components"
import type { Placed } from "./data/types"
import { computeAffinities } from "./engine/affinity"
import { canRepeat } from "./engine/cost"
import { resolve } from "./engine/resolve"
import { useDrag, type DragSource } from "./hooks/useDrag"
import { useEmbed } from "./hooks/useEmbed"
import { useTheme } from "./hooks/useTheme"

const STORAGE_KEY = "spellsmith:chain"

let uidCounter = 0
const nextUid = () => `p${++uidCounter}-${Date.now().toString(36)}`

/** Chains survive a reload, and travel through the URL hash when shared. */
const encode = (chain: Placed[]) =>
  chain
    .map((p) => (p.label ? `${p.componentId}~${encodeURIComponent(p.label)}` : p.componentId))
    .join(",")

const decode = (raw: string): Placed[] =>
  raw
    .split(",")
    .filter(Boolean)
    .flatMap((token) => {
      const [id, label] = token.split("~")
      if (!id || !COMPONENT_BY_ID.has(id)) return []
      return [
        { uid: nextUid(), componentId: id, ...(label ? { label: decodeURIComponent(label) } : {}) },
      ]
    })

const loadInitial = (): Placed[] => {
  const hash = window.location.hash.replace(/^#/, "")
  if (hash) return decode(hash)
  try {
    return decode(window.localStorage.getItem(STORAGE_KEY) ?? "")
  } catch {
    return []
  }
}

export const App = () => {
  useTheme()
  const embed = useEmbed()
  const [chain, setChain] = useState<Placed[]>(loadInitial)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, encode(chain))
    } catch {
      // Private browsing or blocked storage — the app works without it.
    }
  }, [chain])

  const resolution = useMemo(() => resolve(chain), [chain])
  const affinities = useMemo(() => computeAffinities(resolution, COMPONENTS), [resolution])

  const insert = useCallback((componentId: string, index?: number) => {
    setChain((current) => {
      const component = COMPONENT_BY_ID.get(componentId)
      if (!component || !canRepeat(current, component)) return current
      const placed: Placed = { uid: nextUid(), componentId }
      const at = index ?? current.length
      return [...current.slice(0, at), placed, ...current.slice(at)]
    })
  }, [])

  const onDrop = useCallback(
    (source: DragSource, index: number | null) => {
      if (source.kind === "palette") {
        if (index === null) return
        insert(source.componentId, index)
        return
      }
      setChain((current) => {
        const from = current.findIndex((placed) => placed.uid === source.uid)
        if (from < 0) return current
        // Dropped outside the chain: remove it.
        if (index === null) return current.filter((placed) => placed.uid !== source.uid)
        const without = current.filter((placed) => placed.uid !== source.uid)
        const target = index > from ? index - 1 : index
        const moved = current[from]
        if (!moved) return current
        return [...without.slice(0, target), moved, ...without.slice(target)]
      })
    },
    [insert],
  )

  const { drag, dropIndex, beginDrag, setZone, dragging } = useDrag({ onDrop })

  const remove = useCallback((uid: string) => {
    setChain((current) => current.filter((placed) => placed.uid !== uid))
  }, [])

  const relabel = useCallback((uid: string, label: string) => {
    setChain((current) =>
      current.map((placed) => (placed.uid === uid ? { ...placed, label } : placed)),
    )
  }, [])

  const nudge = useCallback((uid: string, delta: number) => {
    setChain((current) => {
      const from = current.findIndex((placed) => placed.uid === uid)
      const to = from + delta
      if (from < 0 || to < 0 || to >= current.length) return current
      const next = [...current]
      const [moved] = next.splice(from, 1)
      if (moved) next.splice(to, 0, moved)
      return next
    })
  }, [])

  const share = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}#${encode(chain)}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.hash = encode(chain)
    }
  }, [chain])

  return (
    <div className="app" data-dragging={dragging}>
      {!embed.compact && (
        <header className="app__head">
          <div>
            <h1>Magie-Effekt entwerfen</h1>
            <p>
              Komponenten zusammensetzen, Stufe ablesen. Wiederholungen werden teurer, und die
              Reihenfolge entscheidet, worauf eine Steigerung wirkt.
            </p>
          </div>
          <LevelBadge level={resolution.level} count={chain.length} />
        </header>
      )}

      {embed.compact && (
        <header className="app__head">
          <h1 style={{ fontSize: "1.1rem" }}>Magie-Effekt entwerfen</h1>
          <LevelBadge level={resolution.level} count={chain.length} />
        </header>
      )}

      <div className="app__body">
        <Palette
          chain={chain}
          affinities={affinities}
          anySelected={chain.length > 0}
          onAdd={insert}
          onBeginDrag={beginDrag}
        />
        <div className="app__workspace">
          <Chain
            chain={chain}
            resolution={resolution}
            drag={drag}
            dropIndex={dropIndex}
            setZone={setZone}
            onRemove={remove}
            onLabel={relabel}
            onMove={nudge}
            onClear={() => setChain([])}
            onBeginDrag={beginDrag}
          />
          <EffectSummary resolution={resolution} />
          <div className="chain__actions">
            <button type="button" className="button" onClick={share} disabled={chain.length === 0}>
              {copied ? "Link kopiert" : "Link zum Effekt kopieren"}
            </button>
          </div>
        </div>
      </div>

      {drag && (
        <div className="ghost" data-size={drag.size} style={{ left: drag.x, top: drag.y }}>
          <span className="slot__name">{drag.label}</span>
          <span className="slot__value">{drag.detail}</span>
        </div>
      )}
    </div>
  )
}

const LevelBadge = ({ level, count }: { level: number; count: number }) => (
  <div className="level" role="status" aria-live="polite">
    <strong>{level}</strong>
    <span>
      Effekt-Stufe · {count} {count === 1 ? "Komponente" : "Komponenten"}
    </span>
  </div>
)
