import { loadJsdomFromUrl } from '../util.js'

export const name = 'Bistro Tout'
export const url = 'https://bistrotout.se'
export const emoji = 'baguette_bread'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const dom = await loadJsdomFromUrl(url)
  const document = dom.window.document

  const header = [...document.querySelectorAll('h2')].find(el => el.textContent?.includes('Dagens Lunch Meny'))
  if (!header) throw new Error('Could not find header')

  const first = header.nextElementSibling?.nextElementSibling?.nextElementSibling?.children[0]
  if (!first) throw new Error('Could not find first todays menu')

  const second = first.parentElement?.nextElementSibling?.children[0]
  if (!second) throw new Error('Could not find second todays menu')

  return [
    { diet: 'all', desc: /** @type {string} */ (first.textContent).trim() },
    { diet: 'all', desc: /** @type {string} */ (second.textContent).trim() }
  ]
}
