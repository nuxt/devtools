import { join } from 'pathe'
import { describe, expect, it } from 'vitest'
import { runtimeDir } from '../src/dirs'
import { importKey, TimelineWrapPlugin, wrapTimelineImports } from '../src/integrations/timeline-wrap'

const HELPER_PATH = '/runtime/function-metrics-helpers'

function keys(wrappable: [source: string, name: string][]) {
  return new Set(wrappable.map(([source, name]) => importKey(source, name)))
}

function wrap(code: string, wrappable: [source: string, name: string][]) {
  return wrapTimelineImports(code, keys(wrappable), HELPER_PATH)?.code
}

describe('wrapTimelineImports', () => {
  it('wraps a bare named import and keeps call sites untouched', () => {
    const result = wrap(
      [
        `import { useState } from '#app/composables/state';`,
        `const counter = useState(() => 0, '$key123' /* nuxt-injected */);`,
      ].join('\n'),
      [['#app/composables/state', 'useState']],
    )
    expect(result).toMatchInlineSnapshot(`
      "import { __nuxtTimelineWrap } from "/runtime/function-metrics-helpers";
      const useState = __nuxtTimelineWrap("useState", _$__useState);
      import { useState as _$__useState } from '#app/composables/state';
      const counter = useState(() => 0, '$key123' /* nuxt-injected */);"
    `)
  })

  it('wraps an aliased import under its local name', () => {
    const result = wrap(
      `import { useState as myState } from '#app/composables/state';`,
      [['#app/composables/state', 'useState']],
    )
    expect(result).toMatchInlineSnapshot(`
      "import { __nuxtTimelineWrap } from "/runtime/function-metrics-helpers";
      const myState = __nuxtTimelineWrap("useState", _$__myState);
      import { useState as _$__myState } from '#app/composables/state';"
    `)
  })

  it('only wraps matched specifiers within an import statement', () => {
    const result = wrap(
      `import { ref, useState, useStateFoo } from '#app/composables/state';`,
      [['#app/composables/state', 'useState']],
    )
    expect(result).toMatchInlineSnapshot(`
      "import { __nuxtTimelineWrap } from "/runtime/function-metrics-helpers";
      const useState = __nuxtTimelineWrap("useState", _$__useState);
      import { ref, useState as _$__useState, useStateFoo } from '#app/composables/state';"
    `)
  })

  it('wraps imports from multiple sources with a single helper import', () => {
    const result = wrap(
      [
        `import { useState } from '#app/composables/state';`,
        `import { useHead } from '@unhead/vue';`,
      ].join('\n'),
      [
        ['#app/composables/state', 'useState'],
        ['@unhead/vue', 'useHead'],
      ],
    )
    expect(result).toMatchInlineSnapshot(`
      "import { __nuxtTimelineWrap } from "/runtime/function-metrics-helpers";
      const useState = __nuxtTimelineWrap("useState", _$__useState);
      const useHead = __nuxtTimelineWrap("useHead", _$__useHead);
      import { useState as _$__useState } from '#app/composables/state';
      import { useHead as _$__useHead } from '@unhead/vue';"
    `)
  })

  it('keeps default and namespace imports untouched while wrapping named ones', () => {
    const result = wrap(
      [
        `import myDefault, { useState } from '#app/composables/state';`,
        `import * as ns from '#app/composables/state';`,
      ].join('\n'),
      [['#app/composables/state', 'useState']],
    )
    expect(result).toMatchInlineSnapshot(`
      "import { __nuxtTimelineWrap } from "/runtime/function-metrics-helpers";
      const useState = __nuxtTimelineWrap("useState", _$__useState);
      import myDefault, { useState as _$__useState } from '#app/composables/state';
      import * as ns from '#app/composables/state';"
    `)
  })

  it('wraps a default import under its local name', () => {
    const result = wrap(
      `import myComposable from '~/composables/myComposable';`,
      [['~/composables/myComposable', 'default']],
    )
    expect(result).toMatchInlineSnapshot(`
      "import { __nuxtTimelineWrap } from "/runtime/function-metrics-helpers";
      const myComposable = __nuxtTimelineWrap("myComposable", _$__myComposable);
      import _$__myComposable from '~/composables/myComposable';"
    `)
  })

  it('ignores imports from other sources', () => {
    expect(wrap(
      `import { useState } from '@vueuse/core';`,
      [['#app/composables/state', 'useState']],
    )).toBeUndefined()
  })

  it('ignores re-exports', () => {
    expect(wrap(
      `export { useState } from '#app/composables/state';`,
      [['#app/composables/state', 'useState']],
    )).toBeUndefined()
  })

  it('ignores imports inside comments and strings', () => {
    expect(wrap(
      [
        `// import { useState } from '#app/composables/state'`,
        `/* import { useState } from '#app/composables/state' */`,
        `const s = "import { useState } from '#app/composables/state'"`,
      ].join('\n'),
      [['#app/composables/state', 'useState']],
    )).toBeUndefined()
  })

  it('is idempotent', () => {
    const code = [
      `import { useState } from '#app/composables/state';`,
      `useState();`,
    ].join('\n')
    const wrappable: [string, string][] = [['#app/composables/state', 'useState']]
    const once = wrap(code, wrappable)
    expect(once).toBeDefined()
    expect(wrap(once!, wrappable)).toBeUndefined()
  })
})

describe('timelineWrapPlugin', () => {
  // Rollup < 4.40 has no native hook filters, so unplugin applies ours before calling the handler
  const [plugin] = [TimelineWrapPlugin({
    helperPath: HELPER_PATH,
    getWrappable: async () => keys([['#app/composables/state', 'useState']]),
  }).rollup()].flat()

  const code = `import { useState } from '#app/composables/state'`

  async function transform(id: string) {
    const hook = plugin!.transform!
    const handler = typeof hook === 'function' ? hook : hook.handler
    // the plugin never touches the Rollup context, so an empty one suffices
    const result = await handler.call({} as never, code, id)
    return typeof result === 'string' ? result : result?.code
  }

  it.each([
    '/app/pages/index.vue',
    '/app/pages/index.vue?vue&type=script&setup=true&lang.ts',
    '/app/composables/foo.ts',
    '/app/utils/bar.mjs',
  ])('transforms %s', async (id) => {
    await expect(transform(id)).resolves.toContain('__nuxtTimelineWrap("useState", _$__useState)')
  })

  it.each([
    '/app/pages/index.vue?vue&type=style&index=0&lang.css',
    '/app/composables/foo.ts?macro=true',
    '/node_modules/some-lib/dist/index.mjs',
    '\0virtual:my-module',
    '/app/assets/style.css',
    // a code extension in the query string must not match a non-code pathname
    '/app/assets/icon.svg?import&fallback=x.js',
    join(runtimeDir, 'plugins/devtools.client.ts'),
  ])('skips %s', async (id) => {
    await expect(transform(id)).resolves.toBeUndefined()
  })
})
