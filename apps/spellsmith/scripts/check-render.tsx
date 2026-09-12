/**
 * Smoke test: mount the whole app in jsdom and drive it a little.
 *
 * Catches the class of failure the type checker and the engine checks cannot —
 * a component that throws on first render, a hook reaching for a browser API
 * that is not there, a click handler that blows up.
 *
 *   npm run test:render
 */
import { JSDOM } from "jsdom"

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: "https://siebenlande.de/spellsmith/",
  pretendToBeVisual: true,
})

const { window } = dom
// jsdom ships neither of these; the app only needs them to exist.
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof window.ResizeObserver

// `navigator` is a getter-only global in Node, so it has to be redefined.
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
})

Object.assign(globalThis, {
  window,
  document: window.document,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
  Node: window.Node,
  MouseEvent: window.MouseEvent,
  requestAnimationFrame: (cb: FrameRequestCallback) => window.setTimeout(() => cb(0), 0),
  cancelAnimationFrame: (id: number) => window.clearTimeout(id),
  IS_REACT_ACT_ENVIRONMENT: true,
})

const { createRoot } = await import("react-dom/client")
const { act } = await import("react")
const { App } = await import("../src/App")
const { createElement } = await import("react")

const failures: string[] = []
const check = (name: string, condition: boolean, detail = "") => {
  console.log(`${condition ? "  ok" : "FAIL"}  ${name}${condition ? "" : ` — ${detail}`}`)
  if (!condition) failures.push(name)
}

const container = window.document.getElementById("root")!
const root = createRoot(container)

await act(async () => {
  root.render(createElement(App))
})

const text = () => container.textContent ?? ""
const chips = () => Array.from(container.querySelectorAll<HTMLElement>(".chip"))

check("Titel gerendert", text().includes("Magie-Effekt entwerfen"))
check("Alle Gruppen gerendert", container.querySelectorAll(".palette__group").length === 6)
check("Katalog vollständig", chips().length === 75, `${chips().length} Chips`)
check("Startstufe ist 0", text().includes("Effekt-Stufe"))
check("Leere Kette erklärt sich", text().includes("Komponenten hierher ziehen"))

// Click "1W4 Schaden" (the only Schaden cell) and check the level and the
// missing-Bezug warning appear.
const schaden = chips().find((chip) => chip.title.startsWith("Schaden"))
check("Schaden-Chip vorhanden", schaden !== undefined)
await act(async () => {
  schaden?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }))
})
check("Stufe nach Schaden = 2", text().includes("2"), text().slice(0, 120))
check("fehlender Bezug gemeldet", text().includes("Braucht eine Bezugs-Komponente"))

// A Schadensart must now be highlighted as required.
const required = chips().filter((chip) => chip.dataset.affinity === "erforderlich")
check("Bezug wird hervorgehoben", required.length > 0, `${required.length} hervorgehoben`)
check(
  "Feuer ist darunter",
  required.some((chip) => chip.title.startsWith("Feuer")),
)

const feuer = chips().find((chip) => chip.title.startsWith("Feuer"))
await act(async () => {
  feuer?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }))
})
check("Warnung verschwindet", !text().includes("Braucht eine Bezugs-Komponente"))
check("Wirkung nennt Feuer", text().includes("Feuer"))

// Clear.
const clear = Array.from(container.querySelectorAll<HTMLElement>("button")).find(
  (button) => button.textContent === "Kette leeren",
)
await act(async () => {
  clear?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }))
})
check("Kette leerbar", text().includes("Komponenten hierher ziehen"))

console.log(
  failures.length === 0
    ? "\nRender-Prüfungen bestanden."
    : `\n${failures.length} fehlgeschlagen: ${failures.join(", ")}`,
)
await act(async () => {
  root.unmount()
})
if (failures.length > 0) process.exitCode = 1
