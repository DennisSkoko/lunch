import { loadCherrioFromUrl } from '../util.js'

export const name = 'Saltimporten'
export const url = 'https://www.saltimporten.com'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const $ = await loadCherrioFromUrl(url)

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'MÅNDAG', // Non-standard Å character
    '2': 'TISDAG',
    '3': 'ONSDAG',
    '4': 'TORSDAG',
    '5': 'FREDAG'
  }

  const dayAsNumber = new Date().getDay()
  const dayAsText = /** @type {string} */ (dayIndexToText[dayAsNumber])

  const vegs = $('[title="Page 1"] p:last-child').text().replace('VEGETARISKT Mån-Ons:', '').split('Tors-Fre:')

  /** @type {Course} */
  const weeklyVeg = {
    diet: 'veg',
    desc: /** @type {string} */ (dayAsNumber <= 3 ? vegs[0] : vegs[1]).trim()
  }

  return [
    {
      diet: 'all',
      desc: $(`[title="Page 1"] strong:contains("${dayAsText}")`)
        .closest('p')
        .text()
        .replace(dayAsText, '')
        .trim()
    },
    weeklyVeg
  ]
}
