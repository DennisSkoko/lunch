import { loadCherrioFromUrl } from '../util.js'

export const name = 'P2'
export const url = 'https://www.restaurangp2.se'
export const emoji = 'p2'

export function hasMenuToday() {
  return true
}

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const $ = await loadCherrioFromUrl(url)

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'monday',
    '2': 'tuesday',
    '3': 'wednesday',
    '4': 'thursday',
    '5': 'friday',
  }

  const dayAsText = dayIndexToText[new Date().getDay()]

  // Every course is labeled, the vegetarian one is called "GREEN"
  return $(`.${dayAsText} .lunchmeny_container`)
    .map((_i, el) => /** @type {Course} */ ({
      diet: $(el).find('.lunch_title').text().trim().toUpperCase() === 'GREEN' ? 'veg' : 'all',
      desc: $(el).find('.lunch_desc').text().trim()
    }))
    .get()
    .filter(course => course.desc)
}
