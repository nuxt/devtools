import fsp from 'node:fs/promises'
import { join, resolve } from 'pathe'
import { imageMeta } from 'image-meta'
import { debounce } from 'perfect-debounce'
import fg from 'fast-glob'
import type { AssetInfo, AssetType, ImageMeta, NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupAssetsRPC({ nuxt, ensureDevAuthToken, refresh }: NuxtDevtoolsServerContext) {
  const _imageMetaCache = new Map<string, ImageMeta | undefined>()
  let cache: AssetInfo[] | null = null

  const publicDir = resolve(nuxt.options.srcDir, nuxt.options.dir.public)

  const refreshDebounced = debounce(() => {
    cache = null
    refresh('getStaticAssets')
  }, 500)

  nuxt.hook('builder:watch', (event, key) => {
    if (key.startsWith(publicDir) && (event === 'add' || event === 'unlink'))
      refreshDebounced()
  })

  async function scan() {
    if (cache)
      return cache

    const baseURL = nuxt.options.app.baseURL
    const files = await fg(['**/*'], {
      cwd: publicDir,
      onlyFiles: true,
    })

    function guessType(path: string): AssetType {
      if (/\.(png|jpe?g|jxl|gif|svg|webp|avif|ico|bmp|tiff?)$/i.test(path))
        return 'image'
      if (/\.(mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|ts|mts|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)$/i.test(path))
        return 'video'
      if (/\.(mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)$/i.test(path))
        return 'audio'
      if (/\.(woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)/i.test(path))
        return 'font'
      if (/\.(json[5c]?|te?xt|[mc]?[jt]sx?|md[cx]?|markdown)/i.test(path))
        return 'text'
      return 'other'
    }

    cache = await Promise.all(files.map(async (path) => {
      const filePath = resolve(publicDir, path)
      const stat = await fsp.lstat(filePath)
      return {
        path,
        publicPath: join(baseURL, path),
        filePath,
        type: guessType(path),
        size: stat.size,
        mtime: stat.mtimeMs,
      }
    }))

    return cache
  }

  return {
    async getStaticAssets() {
      return await scan()
    },
    async getImageMeta(filepath: string) {
      if (_imageMetaCache.has(filepath))
        return _imageMetaCache.get(filepath)
      try {
        const meta = imageMeta(await fsp.readFile(filepath)) as ImageMeta
        _imageMetaCache.set(filepath, meta)
        return meta
      }
      catch (e) {
        _imageMetaCache.set(filepath, undefined)
        console.error(e)
        return undefined
      }
    },
    async getTextAssetContent(filepath: string, limit = 300) {
      try {
        const content = await fsp.readFile(filepath, 'utf-8')
        return content.slice(0, limit)
      }
      catch (e) {
        console.error(e)
        return undefined
      }
    },
    async writeStaticAssets(token: string, files: { name: string; data: string }[], path: string) {
      await ensureDevAuthToken(token)

      const baseDir = resolve(nuxt.options.srcDir, nuxt.options.dir.public + path)

      return await Promise.all(
        files.map(async ({ name, data }) => {
          let dir = resolve(baseDir, name)
          try {
            await fsp.stat(dir)
            const ext = dir.split('.').pop() as string
            const base = dir.slice(0, dir.length - ext.length - 1)
            let i = 1
            while (await fsp.access(`${base}-${i}.${ext}`).then(() => true).catch(() => false))
              i++
            dir = `${base}-${i}.${ext}`
          }
          catch (err) {
            // Ignore error if file doesn't exist
          }
          await fsp.writeFile(dir, data, 'base64')
          return dir
        }),
      )
    },
    async deleteStaticAsset(path: string) {
      return await fsp.unlink(path)
    },
    async renameStaticAsset(oldPath: string, newPath: string) {
      const exist = cache?.find(asset => asset.filePath === newPath)
      if (exist)
        throw new Error(`File ${newPath} already exists`)
      return await fsp.rename(oldPath, newPath)
    },
  } satisfies Partial<ServerFunctions>
}
