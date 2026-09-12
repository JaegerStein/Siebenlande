import { useCallback, useEffect, useRef, useState } from "react"
import type { Size } from "../data/types"

/**
 * Pointer-event based drag and drop.
 *
 * Deliberately not the HTML5 drag-and-drop API: that one does not fire on touch
 * devices and behaves badly inside an iframe. Pointer events give mouse, pen and
 * touch the same path. A drag only starts once the pointer has moved past a
 * threshold, so a plain tap still reaches the element's own click handler and
 * the whole builder stays usable without dragging at all.
 */

export type DragSource =
  { kind: "palette"; componentId: string } | { kind: "chain"; uid: string; index: number }

export interface DragState {
  source: DragSource
  label: string
  detail: string
  size: Size
  x: number
  y: number
}

interface DragOptions {
  /** `index` is the insertion point in the chain, or null when dropped outside. */
  onDrop: (source: DragSource, index: number | null) => void
}

const THRESHOLD = 6

/** Insertion index for a pointer position over a wrapping flow of items. */
const insertionIndex = (zone: HTMLElement, x: number, y: number): number => {
  const items = Array.from(zone.querySelectorAll<HTMLElement>("[data-chain-item]"))
  for (const [index, item] of items.entries()) {
    const rect = item.getBoundingClientRect()
    if (y < rect.bottom && x < rect.left + rect.width / 2) return index
  }
  return items.length
}

export const useDrag = ({ onDrop }: DragOptions) => {
  const [drag, setDrag] = useState<DragState | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const zoneRef = useRef<HTMLElement | null>(null)
  const pending = useRef<{ state: DragState; startX: number; startY: number } | null>(null)
  const active = useRef(false)
  // Lets the pointerup handler read the latest drop index without the window
  // listeners having to re-subscribe on every pointer move.
  const dropIndexRef = useRef<number | null>(null)
  dropIndexRef.current = dropIndex

  const finish = useCallback(() => {
    pending.current = null
    active.current = false
    setDrag(null)
    setDropIndex(null)
  }, [])

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const current = pending.current
      if (!current) return
      if (!active.current) {
        const moved = Math.hypot(event.clientX - current.startX, event.clientY - current.startY)
        if (moved < THRESHOLD) return
        active.current = true
      }
      event.preventDefault()
      const state = { ...current.state, x: event.clientX, y: event.clientY }
      current.state = state
      setDrag(state)

      const zone = zoneRef.current
      if (!zone) return setDropIndex(null)
      const rect = zone.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      setDropIndex(inside ? insertionIndex(zone, event.clientX, event.clientY) : null)
    }

    const onUp = () => {
      const current = pending.current
      if (current && active.current) onDrop(current.state.source, dropIndexRef.current)
      finish()
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish()
    }

    window.addEventListener("pointermove", onMove, { passive: false })
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", finish)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", finish)
      window.removeEventListener("keydown", onKey)
    }
  }, [onDrop, finish])

  const beginDrag = useCallback(
    (source: DragSource, label: string, detail: string, size: Size, event: React.PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return
      pending.current = {
        state: { source, label, detail, size, x: event.clientX, y: event.clientY },
        startX: event.clientX,
        startY: event.clientY,
      }
      active.current = false
    },
    [],
  )

  const setZone = useCallback((element: HTMLElement | null) => {
    zoneRef.current = element
  }, [])

  return { drag, dropIndex, beginDrag, setZone, dragging: drag !== null }
}
