import { load } from 'cheerio'
import fetch from 'node-fetch'

/**
 * @param {string} url
 */ 
export async function loadCherrioFromUrl(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Non ok response code from ${url}`)
  }

  return load(await response.text())
}
