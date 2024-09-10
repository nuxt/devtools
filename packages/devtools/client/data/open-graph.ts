import type { MetaFlatInput } from '@unhead/schema'
import type { ReactiveHead } from '@unhead/vue'

export interface OpenGraphTagDefine {
  name: string
  suggestion: 'required' | 'recommended' | 'optional'
  head: Partial<ReactiveHead>
  seoMeta?: Partial<MetaFlatInput> & { title?: string }
  docs?: string
  description?: string
}

export const ogTags: OpenGraphTagDefine[] = [
  {
    name: 'title',
    suggestion: 'required',
    head: {
      title: '[title]',
    },
    seoMeta: {
      title: '[title]',
    },
    docs: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title',
    description: 'A concise and descriptive title for the browser that accurately summarizes the content of the page.',
  },
  {
    name: 'description',
    suggestion: 'required',
    head: {
      meta: [
        {
          name: 'description',
          content: '[description]',
        },
      ],
    },
    seoMeta: {
      description: '[description]',
    },
    description: 'A one to two sentence summary for search engines that includes relevant keywords to improve visibility in search results.',
  },
  {
    name: 'icon',
    suggestion: 'recommended',
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
      ],
    },
    description: 'A small image that appears in the browser tab and bookmark menu to help users easily identify the page.',
  },
  {
    name: 'lang',
    suggestion: 'recommended',
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
    description: 'The primary language of the page to help search engines and browsers understand the content.',
  },
  {
    name: 'og:title',
    suggestion: 'recommended',
    head: {
      meta: [
        {
          property: 'og:title',
          content: '[og:title]',
        },
      ],
    },
    seoMeta: {
      ogTitle: '[og:title]',
    },
    docs: 'https://ogp.me/#metadata',
    description: 'A title for the link preview used by social media platforms.',
  },
  {
    name: 'og:description',
    suggestion: 'recommended',
    head: {
      meta: [
        {
          property: 'og:description',
          content: '[og:description]',
        },
      ],
    },
    seoMeta: {
      ogDescription: '[og:description]',
    },
    docs: 'https://ogp.me/#metadata',
    description: 'A description for the link preview used by social media platforms.',
  },
  {
    name: 'og:image',
    suggestion: 'recommended',
    head: {
      meta: [
        {
          property: 'og:image',
          content: '[og:image]',
        },
      ],
    },
    seoMeta: {
      ogImage: '[og:image]',
    },
    docs: 'https://ogp.me/#metadata',
    description: 'An image for the link preview used by social media platforms.',
  },
  {
    name: 'og:url',
    suggestion: 'recommended',
    head: {
      meta: [
        {
          property: 'og:url',
          content: '[og:url]',
        },
      ],
    },
    seoMeta: {
      ogUrl: '[og:url]',
    },
    docs: 'https://ogp.me/#metadata',
    description: 'A canonical URL for the link preview used to specify the preferred URL to display in search engine results and social media previews when multiple URLs may point to the same page.',
  },
  {
    name: 'twitter:title',
    suggestion: 'optional',
    head: {
      meta: [
        {
          name: 'twitter:title',
          content: '[twitter:title]',
        },
      ],
    },
    seoMeta: {
      twitterTitle: '[twitter:title]',
    },
    docs: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards',
    description: 'A title for the Twitter card used to provide a preview of the content shared on the page.',
  },
  {
    name: 'twitter:description',
    suggestion: 'optional',
    head: {
      meta: [{
        name: 'twitter:description',
        content: '[twitter:description]',
      }],
    },
    seoMeta: {
      twitterDescription: '[twitter:description]',
    },
    docs: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards',
    description: 'A description for the Twitter card used to provide a preview of the content shared on the page.',
  },
  {
    name: 'twitter:image',
    suggestion: 'optional',
    head: {
      meta: [
        {
          name: 'twitter:image',
          content: '[twitter:image]',
        },
      ],
    },
    seoMeta: {
      twitterImage: '[twitter:image]',
    },
    docs: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards',
    description: 'An image for the Twitter card used to provide a preview of the content shared on the page.',
  },
  {
    name: 'twitter:card',
    suggestion: 'optional',
    head: {
      meta: [
        {
          name: 'twitter:card',
          content: 'summary',
        },
      ],
    },
    seoMeta: {
      twitterCard: 'summary',
    },
    docs: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards',
    description: 'The type of Twitter card to use, which determines the type of card to display in link previews on Twitter.',
  },
]
