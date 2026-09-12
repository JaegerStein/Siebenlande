import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// `base: "./"` keeps every asset reference relative, so the built bundle works
// unchanged whether it is served from /spellsmith/, from a sub-path, or inside
// an iframe on an article page.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
  },
})
