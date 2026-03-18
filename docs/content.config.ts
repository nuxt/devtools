import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['home/**'],
      },
    }),
    home: defineCollection({
      type: 'page',
      source: 'home/**',
    }),
    landing: defineCollection({
      type: 'data',
      source: 'index.yml',
      schema: z.object({
        navigation: z.boolean().optional(),
        hero: z.object({
          title: z.string(),
          description: z.string(),
          button: z.string(),
        }),
        sections: z.array(z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          slot: z.string().optional(),
          button: z.string().optional(),
          avatarText: z.string().optional(),
          toolsCards: z.array(z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string(),
            to: z.string(),
          })).optional(),
          projectCards: z.array(z.object({
            title: z.string(),
            description: z.string(),
            to: z.string(),
          })).optional(),
        })),
      }),
    }),
  },
})
