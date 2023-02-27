export default defineAppConfig({
  docus: {
    title: 'Nuxt DevTools',
    description: 'Unleash Nuxt Developer Experience.',
    image: 'https://repository-images.githubusercontent.com/420050565/6459bd6d-fd45-4bce-918a-9c5fa62a0576',
    socials: {
      twitter: 'nuxt_js',
      github: 'nuxt/devtools',
    },
    github: {
      owner: 'nuxt',
      repo: 'devtools',
      branch: 'main',
      dir: 'docs/content',
      edit: true,
    },
    aside: {
      level: 0,
      exclude: [],
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
    },
    footer: {
      iconLinks: [
        {
          href: 'https://nuxt.com',
          icon: 'IconNuxtLabs',
        },
      ],
    },
  },
})
