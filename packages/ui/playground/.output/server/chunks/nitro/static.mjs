import { createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const assets = {
  "/_nuxt/NuxtExampleLayout-3febf62f.mjs": {
    "type": "application/javascript",
    "etag": "\"649-SWKBi3NyqMOo0vv8U/0TyZTiTQQ\"",
    "mtime": "2021-12-22T19:52:31.778Z",
    "path": "../public/_nuxt/NuxtExampleLayout-3febf62f.mjs"
  },
  "/_nuxt/UnoIcon-9ed2185c.mjs": {
    "type": "application/javascript",
    "etag": "\"91-d25mCpiTQ4McjJk+Z+qkthO2kUs\"",
    "mtime": "2021-12-22T19:52:31.778Z",
    "path": "../public/_nuxt/UnoIcon-9ed2185c.mjs"
  },
  "/_nuxt/entry-de2f6cfa.mjs": {
    "type": "application/javascript",
    "etag": "\"1ac17-hRg0znjXpPiFyGK0kSBbf78UQ1M\"",
    "mtime": "2021-12-22T19:52:31.778Z",
    "path": "../public/_nuxt/entry-de2f6cfa.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"40d-1USNB3BBxY22wE6I+zqR9N+dl84\"",
    "mtime": "2021-12-22T19:52:31.778Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/assets/NuxtExampleLayout.0538cb89.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1-rcg7GeeTSRscbqD9i0bNnzLlkvw\"",
    "mtime": "2021-12-22T19:52:31.778Z",
    "path": "../public/_nuxt/assets/NuxtExampleLayout.0538cb89.css"
  },
  "/_nuxt/assets/entry.5f894968.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f68-vJcju0xr7jG0ayL1mYl4IJWFUFU\"",
    "mtime": "2021-12-22T19:52:31.778Z",
    "path": "../public/_nuxt/assets/entry.5f894968.css"
  },
  "/_nuxt/assets/logo-nuxt3.148d9522.svg": {
    "type": "image/svg+xml",
    "etag": "\"943-wwKfjgdTJGSbw7fgfvGvEiul+q4\"",
    "mtime": "2021-12-22T19:52:31.778Z",
    "path": "../public/_nuxt/assets/logo-nuxt3.148d9522.svg"
  }
};

const mainDir = dirname(fileURLToPath(globalThis.entryURL));

function readAsset (id) {
  return promises.readFile(resolve(mainDir, getAsset(id).path))
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const PUBLIC_PATH = "/_nuxt/";
const TWO_DAYS = 2 * 60 * 60 * 24;
const STATIC_ASSETS_BASE = "/home/pooya/Code/design/packages/ui/playground/dist" + "/" + "1640202749";
async function serveStatic(req, res) {
  if (!METHODS.includes(req.method)) {
    return;
  }
  let id = withLeadingSlash(withoutTrailingSlash(parseURL(req.url).pathname));
  let asset = getAsset(id);
  if (!asset) {
    const _id = id + "/index.html";
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
    }
  }
  if (!asset) {
    if (id.startsWith(PUBLIC_PATH) && !id.startsWith(STATIC_ASSETS_BASE)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    res.statusCode = 304;
    return res.end("Not Modified (etag)");
  }
  const ifModifiedSinceH = req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      res.statusCode = 304;
      return res.end("Not Modified (mtime)");
    }
  }
  if (asset.type) {
    res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    res.setHeader("Last-Modified", asset.mtime);
  }
  if (id.startsWith(PUBLIC_PATH)) {
    res.setHeader("Cache-Control", `max-age=${TWO_DAYS}, immutable`);
  }
  const contents = await readAsset(id);
  return res.end(contents);
}

export { serveStatic as default };
