import type { FullSlug, QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"
import { resolveRelative } from "@quartz-community/utils/path"

const style = `
.slim-properties {
  margin: 0.5rem 0 1rem;
  font-size: 0.9rem;
}
.slim-properties dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.3rem 1rem;
  margin: 0;
}
.slim-properties dt {
  color: var(--gray);
}
.slim-properties dd {
  margin: 0;
}
.slim-properties .tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding-left: 0;
  margin: 0;
}
.slim-properties .tags > li {
  margin: 0;
  white-space: nowrap;
}
.slim-properties a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
}
`

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

    if (!description && aliases.length === 0 && tags.length === 0) return null

    return (
      <div class={`slim-properties ${displayClass ?? ""}`}>
        <dl>
          {description && (
            <>
              <dt>Beschreibung</dt>
              <dd>{description}</dd>
            </>
          )}
          {aliases.length > 0 && (
            <>
              <dt>Aliase</dt>
              <dd>{aliases.join(", ")}</dd>
            </>
          )}
          {tags.length > 0 && (
            <>
              <dt>Tags</dt>
              <dd>
                <ul class="tags">
                  {tags.map((tag) => (
                    <li>
                      <a class="internal tag-link" href={resolveRelative(slug, `tags/${tag}` as FullSlug)}>
                        {tag}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          )}
        </dl>
      </div>
    )
  }

  Component.css = style
  return Component
}
