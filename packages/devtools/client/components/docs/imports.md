# Auto imports

Nuxt auto-imports helper functions, composables and Vue APIs to be used across your application without explicitly importing them. Based on the directory structure, every Nuxt application can also use auto-imports for its own components, composables and plugins. Components, composables or plugins can use these functions.

<hr>

According to your config, exports of files under the following folders will be registed as auto-imports entry:

<HelpImportsDirs />

Meanwhile, modules could also provide auto-imports for their own components. You have auto-imports from the following modules as well:

<HelpImportsModules />

<hr>

[Learn more in the documentation](https://nuxt.com/docs/guide/concepts/auto-imports)

## Directives

Directives placed in the directives/ directory are automatically registered by Nuxt. They can be used in your templates without importing them.

[Learn more in the documentation](https://nuxt.com/docs/guide/directory-structure/directives)
