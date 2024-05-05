import { load } from 'cheerio'
import fetch from 'node-fetch'

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
