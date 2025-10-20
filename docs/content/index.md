---
seo:
  title: "Nuxt DevTools: Unleash Nuxt Developer Experience"
  description: "The Nuxt DevTools gives you insights and transparency about your Nuxt App. Identify performance gaps and seamlessly manage your app configurations."
  ogImage: https://devtools.nuxt.com/social-card.png
---

::Gradient
::

::u-page-hero
---
orientation: horizontal
---
  :::Illustration
  :::

#title
Unleash Nuxt [Developer Experience]{.text-primary}

#description
The Nuxt DevTools gives you insights and transparency about your Nuxt App. Identify performance gaps and seamlessly manage your app configurations.

#links
  :::u-button
  ---
  icon: i-ph-rocket-launch-duotone
  size: xl
  to: /get-started/installation
  ---
  Get started
  :::

  :::u-button
  ---
  icon: i-ph-video-duotone
  size: xl
  color: neutral
  variant: outline
  to: https://www.youtube-nocookie.com/embed/Wkla7ATW8Vc?si=po2wmux2Ybfq0Evm
  ---
  What's Nuxt DevTools?
  :::
::

::u-page-section
#title
Enhance projects with :br [Advanced DevTools]{.text-primary}

#features
  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-code-light
  ---
  #title
  Developer Experience
  
  #description
  Enhance your DX even further, and adding an extra layer of enjoyment to the development journey!
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-magnifying-glass
  ---
  #title
  Inspection & debug
  
  #description
  See the relationships between your components, composables, modules and so much more.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-wall
  ---
  #title
  Transparency conventions
  
  #description
  Understand your Nuxt app structure to debug and optimize your Nuxt application effectively.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-gradient
  ---
  #title
  Real-time insights
  
  #description
  Get real-time insights into your app's performance. Analyze your data for seamless user experience.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-book-open
  ---
  #title
  Tailor-made documentation
  
  #description
  Get personalized documentation for your Nuxt application, based on your usage patterns and needs.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-plug
  ---
  #title
  Extendable & hackable
  
  #description
  Provide interactive views for integrations. Making it easy to explore and understand your application's data and performance.
  :::
::

::u-page-section
---
orientation: horizontal
---
  :::tabs
    ::::tabs-item
    ---
    icon: i-carbon-tree-view-alt
    label: Pages
    ---
      ![pages](/images/pages.webp)
    ::::

    ::::tabs-item
    ---
    icon: i-ph-circles-three
    label: Components
    ---
      ![pages](/images/components.webp)
    ::::

    ::::tabs-item
    ---
    icon: i-carbon-function
    label: Imports
    ---
      ![pages](/images/imports.webp)
    ::::
  :::

#title
Explore the depths of your [Nuxt project]{.text-primary}

#description

<!-- TODO: show the description based on selected tab -->

Display your current routes with useful information such as what layout or middleware it has, and provides a quick way to navigate between pages. You can also use the textbox to see how each route is matched.

Display all the components you are using in your app and where they are from. You can also search for them and go to the source code.

Discover all the auto-imports composables and utils registered in your app. You can see which files are importing them, and where they are from. Some entries can also provide short descriptions and documentation links.

#links
  :::u-button
  ---
  color: neutral
  label: Explore all features
  to: /guide/features
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  :::
::


::u-page-section
#title
Trusted and supported by our :br :br [amazing community]{.text-primary} :br :br

  :::cta
    ::::stars-bg
    ::::
  :::
::

::u-page-section
#title
Get started [Now]{.text-primary}

#description
Start using Nuxt DevTools quickly by enabling it in your projects in a few lines!

  :::u-stepper
  ---
  disabled: true
  items:
    - title: Enable Nuxt DevTools module
      icon: i-ph-code-light
      description: You just need to go to your `nuxt.config` file and set `devtools` to `true`
    - title: Nuxt will automatically install the DevTools module for you.
      icon: i-ph-rocket
  ---
  #content
  <div class="flex justify-center">

  ```ts[nuxt.config.ts]
  export default defineNuxtConfig({
    devtools: {
      enabled: true,
    },
  })
  ```

  </div>
  :::
::
