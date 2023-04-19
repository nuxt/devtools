import type { Nuxt } from 'nuxt/schema'

export async function setup(nuxt: Nuxt) {
  if (nuxt.options.dev || !nuxt.options.build.analyze)
    return

  nuxt.hook('build:analyze:done', async (meta) => {
    // await fsp.writeFile(join(statsDir, 'index.json'), JSON.stringify(<AnalyticBuild>{
    //   buildTime: Date.now(),
    //   dir: statsDir,
    // }, null, 2))
    // console.log('build:analyze:done', meta)
  })
}
