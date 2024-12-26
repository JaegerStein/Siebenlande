import { FilePath, FullSlug, joinSegments, resolveRelative, simplifySlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import path from "path"
import { write } from "./helpers"
import DepGraph from "../../depgraph"

export interface Options {
	subfolder: string
	targetDomain: string
}

export const ShortUrlRedirects: QuartzEmitterPlugin<Options> = (opts = { subfolder: "", targetDomain: "" }) => ({
	name: "ShortUrlRedirects",
	getQuartzComponents() {
		return []
	},
	async getDependencyGraph(ctx, content, _resources) {
		const graph = new DepGraph<FilePath>()

		const { argv } = ctx
		for (const [_tree, file] of content) {
			const uid = file.data.frontmatter?.uid
			if (typeof uid === "string") {
				const slug = path.posix.join(opts.subfolder, uid) as FullSlug
				graph.addEdge(file.data.filePath!, joinSegments(argv.output, slug + ".html") as FilePath)
			}
		}

		return graph
	},
	async emit(ctx, content, _resources): Promise<FilePath[]> {
		const { argv } = ctx
		const fps: FilePath[] = []

		for (const [_tree, file] of content) {
			const ogSlug = simplifySlug(file.data.slug!)
			const uid = file.data.frontmatter?.uid
			if (typeof uid === "string") {
				const slug = path.posix.join(opts.subfolder, uid) as FullSlug

				const redirUrl = `https://${opts.targetDomain}/${file.data.slug!}`
				const fp = await write({
					ctx,
					content: `
            <!DOCTYPE html>
            <html lang="en-us">
            <head>
            <title>${ogSlug}</title>
            <link rel="canonical" href="${redirUrl}">
            <meta name="robots" content="noindex">
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="0; url=${redirUrl}">
            </head>
            </html>
            `,
					slug,
					ext: ".html",
				})

				fps.push(fp)
			}
		}
		return fps
	},
})