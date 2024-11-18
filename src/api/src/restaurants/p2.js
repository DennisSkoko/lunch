import { loadCherrioFromUrl } from '../util.js'

export const name = 'P2'
export const url = 'https://www.restaurangp2.se/lunch'

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

  return $(`.${dayAsText} .lunch_desc`)
    .map((_i, el) => $(el).text().trim())
    .get()
    .map((desc, i) => ({ diet: i === 0 ? 'veg' : 'all', desc }))
}
