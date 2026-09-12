import { build } from "esbuild"
import { sassPlugin } from "esbuild-sass-plugin"

// The esbuild CLI cannot load plugins, so the SCSS import is compiled to a CSS string here.
await build({
  entryPoints: ["src/index.tsx"],
  outfile: "dist/index.js",
  bundle: true,
  format: "esm",
  platform: "node",
  jsx: "automatic",
  jsxImportSource: "preact",
  external: ["preact"],
  plugins: [sassPlugin({ type: "css-text" })],
})
