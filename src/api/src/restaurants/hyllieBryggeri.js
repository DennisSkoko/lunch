import { loadJsdomFromUrl } from '../util.js'

export const name = 'Hyllie Bryggeri'
export const url = 'https://www.hylliebryggeri.se/meny'
export const emoji = 'beer'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const dom = await loadJsdomFromUrl(url)
  const document = dom.window.document

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    1: 'Måndag',
    2: 'Tisdag',
    3: 'Onsdag',
    4: 'Torsdag',
    5: 'Fredag'
  }

  const dayText = dayIndexToText[new Date().getDay()]
  if (!dayText) throw new Error('No lunch menu on weekends.')

  // Find the heading element (<h3> or <p> depending on markup)
  const heading = [...document.querySelectorAll('h3, strong, p')]
    .find(el => el.textContent.trim().startsWith(dayText))

  if (!heading) {
    throw new Error(`Could not find menu section for: ${dayText}`)
  }

  // Next sibling contains the menu description
  let menuText = ''
  let next = heading.nextElementSibling
  while (next && !/^(Måndag|Tisdag|Onsdag|Torsdag|Fredag)/.test(next.textContent)) {
    menuText += next.textContent.trim() + '\n'
    next = next.nextElementSibling
  }

  // Split into lines for potential multiple courses
  const items = menuText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)

  return items.map((desc, i) => ({
    diet: i === 1 ? 'veg' : 'all', // adjust indexing as desired
    desc
  }))
}
