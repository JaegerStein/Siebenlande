import { useEffect, useState } from "react"

/**
 * Embed awareness.
 *
 * Standalone tab: the app fills the viewport and scrolls its own columns.
 * Inside an iframe: the app grows with its content and reports its height to
 * the host, so the article can size the frame without an inner scrollbar.
 *
 * A host listens with:
 *   window.addEventListener("message", (e) => {
 *     if (e.data?.type === "spellsmith:height") frame.style.height = e.data.height + "px"
 *   })
 */
export interface EmbedState {
  /** Running inside an iframe. */
  embedded: boolean
  /** `?embed=1` — trims the page chrome down to the builder itself. */
  compact: boolean
}

const isEmbedded = () => {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

export const useEmbed = (): EmbedState => {
  const [state] = useState<EmbedState>(() => {
    const params = new URLSearchParams(window.location.search)
    const embedded = isEmbedded()
    return { embedded, compact: params.get("embed") === "1" || embedded }
  })

  useEffect(() => {
    document.documentElement.dataset.embed = state.embedded ? "1" : "0"
    if (!state.embedded) return

    let last = 0
    const report = () => {
      const height = Math.ceil(document.documentElement.scrollHeight)
      if (height === last) return
      last = height
      window.parent.postMessage({ type: "spellsmith:height", height }, "*")
    }

    const observer = new ResizeObserver(report)
    observer.observe(document.documentElement)
    window.addEventListener("load", report)
    report()

    return () => {
      observer.disconnect()
      window.removeEventListener("load", report)
    }
  }, [state.embedded])

  return state
}
