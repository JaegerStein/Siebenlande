import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./styles/index.scss"

const container = document.getElementById("root")
if (!container) throw new Error("Kein #root-Element gefunden.")

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
