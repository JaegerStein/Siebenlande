# Spellsmith

Interactive builder for the component magic of the Siebenlande rule set. Users
drag components onto a chain; the app prices the chain, resolves what the effect
actually does, and highlights which components pair with the current selection.

Display title: **Magie-Effekt entwerfen**. All user-facing text is German; the
implementation is English.

Source of truth: [`Siebenlande/Regeln/Magie/Magie.md`](../../Siebenlande/Regeln/Magie/Magie.md).
When those tables change, change [`src/data/components.ts`](src/data/components.ts)
to match and re-run the tests.

## Commands

```bash
npm install
npm run dev      # vite dev server
npm run build    # type-check, then build to dist/ (local check, not published)
npm run test     # engine checks + jsdom render smoke test
npm run publish  # test, type-check, then build into quartz/static/spellsmith/
```

## How the rules are modelled

**One filled table cell is exactly one component.** Each cell of the rule tables
becomes one entry in the catalogue with its own id (`schaden.mittel`,
`bessere-wuerfel.klein`). This is what makes repetition pricing correct:
component identity runs through the cell, so `^1` twice is a repetition while
`^1` plus `^2` is not. The palette is laid out the same way — row label on the
left, one chip per available size — so the rule tables and the UI stay legible
against each other.

**Repetition pricing.** The n-th copy of a component costs `n × base`, which
reproduces all three worked examples in the chapter (`1+2+3`, `2+4+6`). The
current rule text states the escalation without exception, so Große Komponenten
repeat too; flip `GROSS_IS_REPEATABLE` in [`src/engine/cost.ts`](src/engine/cost.ts)
if that should go back to being forbidden.

**Art interactions run between groups, not inside one.** Two components sharing
an Art only interact when they sit in different groups — that is what keeps
`Schaden` and `RW unterstützen` (both Würfel, both Wirkung) apart. `SG erschweren`
is the one documented exception, since its description names its target
explicitly. See [`src/engine/interaction.ts`](src/engine/interaction.ts).

**Modifiers bind backwards.** A Steigerung attaches to the nearest preceding
component it can actually act on, so chain order is meaningful:
`1W4 Schaden · Feuer · Mehr Würfel +1` is 2W4 fire, and moving a second Wirkung
in between changes what the modifier grabs. A modifier that finds no target says
so rather than disappearing quietly.

**Empty Art cells are a statement.** Reichweite, Länge, Breite, Radius and
Bewegung carry no Art and therefore take no `Flacher Wert`; they grow by stacking
further Form components instead.

## Embedding

Stable path on the server: **`/static/spellsmith/`**. Assets are referenced
relatively, so the folder also works if it is ever moved or opened from disk.
Two modes:

- **Standalone tab** — `https://siebenlande.de/static/spellsmith/`. Fills the
  viewport, columns scroll independently.
- **Iframe in an article** — the page grows with its content and posts its height
  to the host, so the frame can be sized without an inner scrollbar:

  ```html
  <iframe
    src="/static/spellsmith/?embed=1"
    style="width:100%;border:0"
    title="Magie-Effekt entwerfen"
  ></iframe>
  <script>
    addEventListener("message", (e) => {
      if (e.data?.type === "spellsmith:height") {
        document.querySelector("iframe[title='Magie-Effekt entwerfen']").style.height =
          e.data.height + "px"
      }
    })
  </script>
  ```

Theme follows, in order: `?theme=dark|light` in the URL, the host page's Quartz
theme (readable because the frame is same-origin on siebenlande.de), then the
visitor's OS preference. A host can also push changes at runtime by posting
`{ type: "spellsmith:theme", theme: "dark" }` into the frame.

A chain is kept in `localStorage` and can be shared as a link — the chain is
encoded in the URL hash using the stable component ids.

## Publishing

The app is **not** built by CI. A published version is made deliberately, by
hand:

```bash
npm run publish
```

That runs the tests, type-checks, and writes the bundle into
`quartz/static/spellsmith/`, which is committed. Quartz copies `quartz/static/`
into its output verbatim on every site build, so the app reaches the server
without the deploy workflow knowing anything about it, and the site build stays
as fast as it was.

The published bundle is therefore a decision, not a side effect: source changes
in `apps/spellsmith/` have no effect on the live page until someone runs
`npm run publish` and commits the result.

## Layout

```
src/
  data/         catalogue and domain types, transcribed from Magie.md
  engine/       cost, Art interaction, chain resolution, affinity highlighting
  hooks/        pointer drag-and-drop, theme, embed/height reporting
  components/   Palette, Chain, EffectSummary
  styles/       SCSS; tokens mirror quartz.config.yaml
scripts/        the two test entry points
```

Drag and drop is pointer-event based rather than HTML5 DnD, which does not fire
on touch and behaves badly in an iframe. A drag only starts past a small movement
threshold, so a plain tap still counts as a click and the whole builder works
without dragging at all.
