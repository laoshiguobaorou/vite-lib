import { Plugin, ResolvedConfig } from 'vite'
import sizeOf from 'image-size'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'
import { basename, join } from 'path'
import { existsSync } from 'fs'

const IMAGE_REGEX = /\.(?:png|jpe?g)(?:\?.*)?/i

export default function imagePlugin (): Plugin {
  let resolvedConfig: ResolvedConfig
  return {
    name: 'image',
    configResolved (config) {
      resolvedConfig = config
    },
    async transform (code: string, id: string): Promise<string> {
      if (!IMAGE_REGEX.test(id)) {
        return code
      }

      // trim query
      const idPath = id.split('?')[0]
      let isPublic = false
      let fn = join(resolvedConfig.root, idPath)
      if (!existsSync(fn)) {
        fn = join(resolvedConfig.publicDir, idPath)
        if (!existsSync(fn)) {
          resolvedConfig.logger.warn(`cannot resolve image '${id}'`)
          return code
        }
        isPublic = true
      }

      const { width, height, orientation, type } = await new Promise<ISizeCalculationResult>((resolve, reject) => sizeOf(fn, ((e, r) => e ? reject(e!) : resolve(r!))))
      resolvedConfig.logger.info(`read size of${isPublic ? ' public ' : ' '}image ${id}`)

      return `
      ${code}
      export const dimension = ${JSON.stringify({ width, height, orientation, type })};
      export const alt = ${JSON.stringify(basename(fn))};
      `
    },
  }
}
