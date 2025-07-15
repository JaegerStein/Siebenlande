import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"
import { FullSlug, splitAnchor } from "../../util/path"

export const MissingLinks: QuartzTransformerPlugin = () => {
  return {
    name: "MissingLinks",
    htmlPlugins(ctx) {
      return [
        () => {
          return (tree) => {
            // Visit all anchor tags in the HTML AST
            visit(tree, "element", (node: any) => {
              if (node.tagName === "a" && node.properties?.href) {
                const href = node.properties.href as string
                
                // Skip pure anchor links (starting with #)
                if (href.startsWith("#")) {
                  return
                }
                
                // Check if it's an internal link (has internal class or no external protocols)
                const classes = (node.properties.className ?? []) as string[]
                const isInternal = classes.includes("internal") || 
                  (!href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:"))
                
                if (isInternal) {
                  // Use the data-slug property that CrawlLinks sets, or fall back to href processing
                  let targetSlug: FullSlug
                  
                  if (node.properties["data-slug"]) {
                    // Use the slug that CrawlLinks already calculated
                    // Split off any anchor part to get just the page slug
                    const fullSlug = node.properties["data-slug"] as FullSlug
                    const [pageSlug, _anchor] = splitAnchor(fullSlug)
                    targetSlug = pageSlug as FullSlug
                  } else {
                    // Fallback: process the href manually
                    const cleanPath = href.replace(/^\//, "").replace(/\.html$/, "")
                    const [pageSlug, _anchor] = splitAnchor(cleanPath)
                    targetSlug = pageSlug as FullSlug
                  }
                  
                  // Check if the slug exists in allSlugs from the build context
                  if (!ctx.allSlugs.includes(targetSlug)) {
                    // Add missing-link class to the anchor element
                    const existingClass = node.properties.className || []
                    node.properties.className = Array.isArray(existingClass) 
                      ? [...existingClass, "missing-link"]
                      : [existingClass, "missing-link"].filter(Boolean)
                  }
                }
              }
            })
          }
        },
      ]
    },
  }
}
