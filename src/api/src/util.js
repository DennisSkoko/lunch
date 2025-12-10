import { load } from 'cheerio'
import { JSDOM, VirtualConsole } from 'jsdom'
import fetch from 'node-fetch'
import { DOMMatrix, Path2D, ImageData, Image } from '@napi-rs/canvas'

// Polyfill browser globals for pdfjs
;/** @type {any} */ (global).DOMMatrix = DOMMatrix
;/** @type {any} */ (global).Path2D = Path2D
;/** @type {any} */ (global).ImageData = ImageData
;/** @type {any} */ (global).Image = Image

// Using dynamic import in order to set the polyfills (above) before pdf-parse is loaded.
// I used the solution from (modified a bit) https://github.com/mehmet-kozan/pdf-parse/issues/10#issuecomment-3381053495
const { PDFParse } = await import('pdf-parse')

/**
 * @param {string} url
 */ 
export async function loadCherrioFromUrl(url) {
  const response = await fetch(url, {
    headers: {
      // Add headers in order to mimic a browser, some websites block unknown user agents
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
      'Accept': 'text/html',
      'Accept-Language': 'sv,en;q=0.5',
    }
  })

  if (!response.ok) {
    throw new Error(`Non ok response code (${response.status}) from ${url}`)
  }

  return load(await response.text())
}

/**
 * @param {string} url
 */
export async function loadJsdomFromUrl(url) {
  const response = await fetch(url, {
    headers: {
      // Add headers in order to mimic a browser, some websites block unknown user agents
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
      'Accept': 'text/html',
      'Accept-Language': 'sv,en;q=0.5',
    }
  })

  if (!response.ok) {
    throw new Error(`Non ok response code (${response.status}) from ${url}`)
  }

  const virtualConsole = new VirtualConsole()
  virtualConsole.sendTo(console, { omitJSDOMErrors: true })

  return new JSDOM(await response.text(), { virtualConsole })
}

/**
 * @template T
 * @param {() => Promise<T>} task
 * @returns {Promise<T>}
 */
export async function retry(task) {
  let retries = 0
  let latestError = null

  while (retries < 3) {
    try {
      return await task()
    } catch (error) {
      latestError = error
      await wait(1000)
    }

    retries += 1
  }

  throw latestError
}

/**
 * @param {number} ms
 */
export async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function readPdfFromUrl(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Non ok response code (${response.status}) from ${url}`)
  }
  const parser = new PDFParse({ url });
  const pdfText = await parser.getText();
  if (!pdfText) throw new Error("Failed to parse PDF");
  return pdfText.text
}
