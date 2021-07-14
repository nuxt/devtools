# Nuxt Design

Unified designs for the [Nuxt Framework](https://nuxtjs.com).

## Usage

Each template can be imported as a JS file or pulled in as raw HTML.

```js
import { template } from '@nuxt/design/dist/templates/error-404'
// or
const templateFile = readFileSync('./node_modules/@nuxt/design/dist/templates/error-404/index.html', 'utf-8')

const html = template({
  error_404: '404',
  error_404_message: 'Sorry, the page you are looking for could not be found.',
  error_server: 'Server error',
  error_server_message: 'An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.',
  back_home: 'Go back home',
  name: 'Nuxt'
})
```

Other assets are located in `assets/`, `icons/`, and `images/`.

## Development

- Clone the repository
- Install dependencies with `yarn install`
- Start development server with `yarn dev`
- Open `http://localhost:3000/` for a list of all the templates

To add a new template, simply create a new file: `./templates/<templateName>/index.html`.

# License

<a rel="license" href="http://creativecommons.org/licenses/by-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nd/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Nuxt Design System</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">Nuxt Project</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nd/4.0/">Creative Commons Attribution-NoDerivatives 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/nuxt/design" rel="dct:source">https://github.com/nuxt/design</a>.
