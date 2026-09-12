import { useEffect, useState } from "react"

export type Theme = "light" | "dark"

/**
 * Resolves the theme the app should render in, in priority order:
 *
 *  1. `?theme=dark` / `?theme=light` in the URL — lets an article embed pin it.
 *  2. The host page's Quartz theme (`saved-theme` on `<html>`), readable because
 *     the iframe and the site are same-origin on siebenlande.de.
 *  3. The visitor's OS preference.
 *
 * A host can also push changes at runtime by posting
 * `{ type: "spellsmith:theme", theme: "dark" }` to the frame.
 */
const readHostTheme = (): Theme | null => {
  try {
    const host = window.parent !== window ? window.parent.document.documentElement : null
    const saved = host?.getAttribute("saved-theme") ?? host?.getAttribute("data-theme")
    if (saved === "dark" || saved === "light") return saved
  } catch {
    // Cross-origin embed: not readable, fall through to the OS preference.
  }
  return null
}

const readUrlTheme = (): Theme | null => {
  const value = new URLSearchParams(window.location.search).get("theme")
  return value === "dark" || value === "light" ? value : null
}

const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches

export const useTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>(
    () => readUrlTheme() ?? readHostTheme() ?? (prefersDark() ? "dark" : "light"),
  )

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  useEffect(() => {
    // The URL pin wins permanently — never override it.
    if (readUrlTheme()) return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onMedia = () => setTheme(readHostTheme() ?? (media.matches ? "dark" : "light"))
    media.addEventListener("change", onMedia)

    const onMessage = (event: MessageEvent) => {
      const data: unknown = event.data
      if (typeof data !== "object" || data === null) return
      const message = data as { type?: unknown; theme?: unknown }
      if (message.type !== "spellsmith:theme") return
      if (message.theme === "dark" || message.theme === "light") setTheme(message.theme)
    }
    window.addEventListener("message", onMessage)

    return () => {
      media.removeEventListener("change", onMedia)
      window.removeEventListener("message", onMessage)
    }
  }, [])

  return theme
}
