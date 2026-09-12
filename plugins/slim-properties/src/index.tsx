import type { FullSlug, QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"
import { resolveRelative } from "@quartz-community/utils/path"
import style from "./styles.scss"

function toStringList(value: unknown): string[] {
  if (value === null || value === undefined) return []
  const items = Array.isArray(value) ? value : [value]
  return items.map((item) => String(item).trim()).filter((item) => item.length > 0)
}

export const SlimProperties: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ fileData, displayClass }) => {
    const frontmatter = (fileData.frontmatter ?? {}) as Record<string, unknown>
    const slug = fileData.slug!

    const description =
      typeof frontmatter.description === "string" ? frontmatter.description.trim() : ""
    const aliases = toStringList(frontmatter.aliases)
    // Tags are already slugified by the note-properties transformer.
    const tags = toStringList(frontmatter.tags)

    // Always rendered: without any properties only the divider remains.
    return (
      <div class={`slim-properties ${displayClass ?? ""}`}>
        {aliases.length > 0 && (
          <p class="aliases">
            {aliases.map((alias, i) => (
              <>
                {i > 0 && <span class="separator">, </span>}
                <span class="alias">{alias}</span>
              </>
            ))}
          </p>
        )}
        {tags.length > 0 && (
          <ul class="tags">
            {tags.map((tag) => (
              <li>
                <a class="internal tag-link" href={resolveRelative(slug, `tags/${tag}` as FullSlug)}>
                  {tag}
                </a>
              </li>
            ))}
          </ul>
        )}
        {description && <p class="description">{description}</p>}
        <hr />
      </div>
    )
  }

  Component.css = style
  return Component
}
