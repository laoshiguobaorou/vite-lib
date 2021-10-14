import { Plugin, ResolvedConfig } from 'vite'
import { dirname, join, resolve } from 'path'
import { existsSync, statSync } from 'fs'
import { readdir, stat } from 'fs/promises'
import { parse } from 'qs'
import { ResolveIdResult } from 'rollup'

export default function importDirPlugin (): Plugin {
  let resolvedConfig: ResolvedConfig
  return {
    name: 'import-dir',
    configResolved (config) {
      resolvedConfig = config
    },
    async resolveId (source: string, importer: string | undefined): Promise<ResolveIdResult> {
      const [id, query] = source.split('?')
      const buildId = async (n: string) => {
        this.warn(n)
        if ((await stat(n)).isDirectory()) {
          return `${n}?dir${query ? `&${query}` : ''}`
        } else {
          return source
        }
      }

      let fn = undefined
      if (importer) {
        if (/\?dir(?:$|&)/.test(importer)) {
          fn = join(importer.split('?')[0], id)
        } else {
          fn = join(dirname(importer), id)
        }

        if (existsSync(fn)) {
          return buildId(fn)
        }
      }

      if (id.startsWith('/')) {
        fn = join(resolvedConfig.root, id)
        if (existsSync(fn)) {
          return buildId(fn)
        }
      }

      fn = join(resolvedConfig.publicDir, id)
      if (existsSync(fn)) {
        return buildId(fn)
      }

      if (id.startsWith('/')) {
        fn = id
        if (existsSync(fn)) {
          return buildId(fn)
        }
      }

      return undefined
    },
    async load (id: string): Promise<string | undefined> {
      if (!/\?dir(?:$|&)/.test(id)) {
        return undefined
      }

      resolvedConfig.logger.info('resolving ' + id)
      const [fn, query] = id.split('?')
      const { recursive } = parse(query)

      const list = await readdir(fn)

      // build script
      const files = list
        .filter(file => {
          if (recursive) {
            return true
          }
          return statSync(resolve(fn, file)).isFile()
        })
      const namedImports = files.map((file, i) => `import * as named_${i} from './${file}';`)
        .join('\n')

      const exportNamed = `export default [${files.map((_, i) => `named_${i}`).join(', ')}];`

      const source = [namedImports, exportNamed].join('\n')
      console.log(source)
      return source
    },
  }
}
