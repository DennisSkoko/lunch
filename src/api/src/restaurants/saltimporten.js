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

  const veg = $('[title="Page 1"] p:last-child').text().replace('VEGETARISKT Mån-Ons:', '')
  /** @type {string | undefined} */
  let weeklyVegDesc = undefined

  if (veg.includes('Tors Fre:') || veg.includes('Tors-Fre:')) {
    const parts = veg.split('Tors Fre:').flatMap(parts => parts.split('Tors-Fre:'))
    weeklyVegDesc = dayAsNumber <= 3 ? parts[0] : parts[1]
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
    {
      diet: 'veg',
      desc: /** @type {string} */ (weeklyVegDesc).trim()
    }
  ]
}
