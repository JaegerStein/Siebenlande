import { FilePath, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
<<<<<<< HEAD
import chalk from "chalk"
=======
import { styleText } from "util"
>>>>>>> upstream/v4

export function extractDomainFromBaseUrl(baseUrl: string) {
  const url = new URL(`https://${baseUrl}`)
  return url.hostname
}

export const CNAME: QuartzEmitterPlugin = () => ({
  name: "CNAME",
  async emit({ argv, cfg }) {
    if (!cfg.configuration.baseUrl) {
<<<<<<< HEAD
      console.warn(chalk.yellow("CNAME emitter requires `baseUrl` to be set in your configuration"))
=======
      console.warn(
        styleText("yellow", "CNAME emitter requires `baseUrl` to be set in your configuration"),
      )
>>>>>>> upstream/v4
      return []
    }
    const path = joinSegments(argv.output, "CNAME")
    const content = extractDomainFromBaseUrl(cfg.configuration.baseUrl)
    if (!content) {
      return []
    }
    await fs.promises.writeFile(path, content)
    return [path] as FilePath[]
  },
  async *partialEmit() {},
})
