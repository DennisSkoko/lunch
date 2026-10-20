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

  const today = new Date().getDay()

  // Each dish is prefixed with the days it is served, e.g. "(Månd – Tisd)" or "(Onsd)"
  const courses = [first, second]
    .flatMap(column => [...column.querySelectorAll('h5')])
    .map(el => /** @type {string} */ (el.textContent).trim())
    .filter(desc => desc && isServedOn(desc, today))
    .map(desc => desc.replace(/^\([^)]*\)\s*/, ''))

  if (courses.length === 0) throw new Error('Could not find any dishes for today')

  return courses.map(desc => /** @type {Course} */ ({ diet: 'all', desc }))
}

const dayPrefixes = ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör']

/**
 * @param {string} desc
 * @param {number} day
 */
function isServedOn(desc, day) {
  const days = desc.match(/^\(([^)]*)\)/)?.[1]
  if (!days) return true

  const range = days
    .split(/[–-]/)
    .map(part => dayPrefixes.indexOf(part.trim().slice(0, 3).toLowerCase()))
  const start = /** @type {number} */ (range[0])
  const end = range[1] ?? start

  return start <= day && day <= end
}
