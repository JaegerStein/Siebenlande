import { PerfTimer } from "../util/perf"
import { getStaticResourcesFromPlugins } from "../plugins"
import { ProcessedContent } from "../plugins/vfile"
import { QuartzLogger } from "../util/log"
import { trace } from "../util/trace"
import { BuildCtx } from "../util/ctx"
<<<<<<< HEAD
import chalk from "chalk"
=======
import { styleText } from "util"
>>>>>>> upstream/v4

export async function emitContent(ctx: BuildCtx, content: ProcessedContent[]) {
  const { argv, cfg } = ctx
  const perf = new PerfTimer()
  const log = new QuartzLogger(ctx.argv.verbose)

  log.start(`Emitting files`)

  let emittedFiles = 0
  const staticResources = getStaticResourcesFromPlugins(ctx)
  await Promise.all(
    cfg.plugins.emitters.map(async (emitter) => {
      try {
        const emitted = await emitter.emit(ctx, content, staticResources)
        if (Symbol.asyncIterator in emitted) {
          // Async generator case
          for await (const file of emitted) {
            emittedFiles++
            if (ctx.argv.verbose) {
              console.log(`[emit:${emitter.name}] ${file}`)
            } else {
<<<<<<< HEAD
              log.updateText(`${emitter.name} -> ${chalk.gray(file)}`)
=======
              log.updateText(`${emitter.name} -> ${styleText("gray", file)}`)
>>>>>>> upstream/v4
            }
          }
        } else {
          // Array case
          emittedFiles += emitted.length
          for (const file of emitted) {
            if (ctx.argv.verbose) {
              console.log(`[emit:${emitter.name}] ${file}`)
            } else {
<<<<<<< HEAD
              log.updateText(`${emitter.name} -> ${chalk.gray(file)}`)
=======
              log.updateText(`${emitter.name} -> ${styleText("gray", file)}`)
>>>>>>> upstream/v4
            }
          }
        }
      } catch (err) {
        trace(`Failed to emit from plugin \`${emitter.name}\``, err as Error)
      }
    }),
  )

  log.end(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince()}`)
}
