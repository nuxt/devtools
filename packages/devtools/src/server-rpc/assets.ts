import fsp from 'node:fs/promises'
import { parse, relative } from 'node:path'
import { imageMeta } from 'image-meta'
import { join, resolve } from 'pathe'
import { debounce } from 'perfect-debounce'
import { glob } from 'tinyglobby'
import { defaultAllowedExtensions } from '../constant'
import type { AssetEntry, AssetInfo, AssetType, ImageMeta, NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupAssetsRPC({ nuxt, ensureDevAuthToken, refresh, options }: NuxtDevtoolsServerContext) {
  const _imageMetaCache = new Map<string, ImageMeta | undefined>()
  let cache: AssetInfo[] | null = null

  const extensions = options.assets?.uploadExtensions || defaultAllowedExtensions
  const publicDir = resolve(nuxt.options.srcDir, nuxt.options.dir.public)
  const layerDirs = [publicDir, ...nuxt.options._layers.map(layer => resolve(layer.cwd, 'public'))]

  const refreshDebounced = debounce(() => {
    cache = null
    refresh('getStaticAssets')
  }, 500)

  nuxt.hook('builder:watch', (event, key) => {
    key = relative(nuxt.options.srcDir, resolve(nuxt.options.srcDir, key))
    if (key.startsWith(nuxt.options.dir.public) && (event === 'add' || event === 'unlink'))
      refreshDebounced()
  })

  async function scan() {
    if (cache)
      return cache

    const baseURL = nuxt.options.app.baseURL
    const dirs: { layerDir: string, files: string[] }[] = []

    for (const layerDir of layerDirs) {
      const files = await glob(['**/*'], {
        cwd: layerDir,
        onlyFiles: true,
      })
      dirs.push({ layerDir, files })
    }

    const uniquePaths = new Set()
    cache = []

    for (const { layerDir, files } of dirs) {
      for (const path of files) {
        const filePath = resolve(layerDir, path)
        const stat = await fsp.lstat(filePath)
        const fullPath = join(baseURL, path)

        // Check if path already exists in uniquePaths set
        if (!uniquePaths.has(fullPath)) {
          cache.push({
            path,
            publicPath: fullPath,
            filePath,
            type: guessType(path),
            size: stat.size,
            mtime: stat.mtimeMs,
            layer: publicDir !== layerDir ? layerDir : undefined,
          })
          uniquePaths.add(fullPath)
        }
      }
    }

    return cache.sort((a, b) => a.path.localeCompare(b.path))
  }

  return {
    async getStaticAssets() {
      return await scan()
    },
    async getImageMeta(token: string, filepath: string) {
      await ensureDevAuthToken(token)

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
    async getTextAssetContent(token: string, filepath: string, limit = 300) {
      await ensureDevAuthToken(token)

      try {
        const content = await fsp.readFile(filepath, 'utf-8')
        return content.slice(0, limit)
      }
      catch (e) {
        console.error(e)
        return undefined
      }
    },
    async writeStaticAssets(token: string, files: AssetEntry[], folder: string) {
      await ensureDevAuthToken(token)

      const baseDir = resolve(nuxt.options.srcDir, nuxt.options.dir.public + folder)

      return await Promise.all(
        files.map(async ({ path, content, encoding, override }) => {
          let finalPath = resolve(baseDir, path)

          const { ext } = parse(finalPath)
          if (extensions !== '*') {
            if (!extensions.includes(ext.toLowerCase().slice(1)))
              throw new Error(`File extension ${ext} is not allowed to upload, allowed extensions are: ${extensions.join(', ')}\nYou can configure it in Nuxt config at \`devtools.assets.uploadExtensions\`.`)
          }

          if (!override) {
            try {
              await fsp.stat(finalPath)
              const base = finalPath.slice(0, finalPath.length - ext.length - 1)
              let i = 1
              while (await fsp.access(`${base}-${i}.${ext}`).then(() => true).catch(() => false))
                i++
              finalPath = `${base}-${i}.${ext}`
            }
            catch {
              // Ignore error if file doesn't exist
            }
          }
          await fsp.writeFile(finalPath, content, {
            encoding: encoding ?? 'utf-8',
          })
          return finalPath
        }),
      )
    },
    async deleteStaticAsset(token: string, path: string) {
      await ensureDevAuthToken(token)

      return await fsp.unlink(path)
    },
    async renameStaticAsset(token: string, oldPath: string, newPath: string) {
      await ensureDevAuthToken(token)

      const exist = cache?.find(asset => asset.filePath === newPath)
      if (exist)
        throw new Error(`File ${newPath} already exists`)
      return await fsp.rename(oldPath, newPath)
    },
  } satisfies Partial<ServerFunctions>
}

const reImage = /\.(?:png|jpe?g|jxl|gif|svg|webp|avif|ico|bmp|tiff?)$/i
const reVideo = /\.(?:mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|ts|mts|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)$/i
const reAudio = /\.(?:mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)$/i
const reFont = /\.(?:woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)/i
const reText = /\.(?:json[5c]?|te?xt|[mc]?[jt]sx?|md[cx]?|markdown)/i

function guessType(path: string): AssetType {
  if (reImage.test(path))
    return 'image'
  if (reVideo.test(path))
    return 'video'
  if (reAudio.test(path))
    return 'audio'
  if (reFont.test(path))
    return 'font'
  if (reText.test(path))
    return 'text'
  return 'other'
}
