import { describe, expect, it } from 'vitest'
import { TRANSFORM_ID_EXCLUDE, TRANSFORM_ID_INCLUDE, wrapTimelineImports } from '../src/integrations/timeline-wrap'

function shouldTransform(id: string): boolean {
  return TRANSFORM_ID_INCLUDE.some(re => re.test(id)) && !TRANSFORM_ID_EXCLUDE.some(re => re.test(id))
}

const HELPER_PATH = '/runtime/function-metrics-helpers'

function wrap(code: string, wrappable: [source: string, name: string][]) {
  return wrapTimelineImports(
    code,
    (source, name) => wrappable.some(([s, n]) => s === source && n === name),
    HELPER_PATH,
  )?.code
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

  it('keeps default imports untouched while wrapping named ones', () => {
    const result = wrap(
      `import myDefault, { useState } from '#app/composables/state';`,
      [['#app/composables/state', 'useState']],
    )
    expect(result).toMatchInlineSnapshot(`
      "import { __nuxtTimelineWrap } from "/runtime/function-metrics-helpers";
      const useState = __nuxtTimelineWrap("useState", _$__useState);
      import myDefault, { useState as _$__useState } from '#app/composables/state';"
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

  it('ignores code without imports', () => {
    expect(wrap('const useState = () => {}', [['#app/composables/state', 'useState']])).toBeUndefined()
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

describe('shouldTransform', () => {
  it.each([
    ['/app/pages/index.vue', true],
    ['/app/pages/index.vue?vue&type=script&setup=true&lang.ts', true],
    ['/app/composables/foo.ts', true],
    ['/app/utils/bar.mjs', true],
    ['/app/pages/index.vue?vue&type=style&index=0&lang.css', false],
    ['/app/composables/foo.ts?macro=true', false],
    ['/node_modules/some-lib/dist/index.mjs', false],
    ['\0virtual:my-module', false],
    ['/app/assets/style.css', false],
    // a code extension in the query string must not match a non-code pathname
    ['/app/assets/icon.svg?import&fallback=x.js', false],
  ])('%s -> %s', (id, expected) => {
    expect(shouldTransform(id)).toBe(expected)
  })
})
