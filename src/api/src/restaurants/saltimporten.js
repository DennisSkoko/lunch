import { loadCherrioFromUrl } from '../util.js'

export const name = 'Saltimporten'
export const url = 'https://www.saltimporten.com'
export const emoji = 'salt'

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

  const veg = $('[title="Page 1"] p')
    .filter((_i, el) => $(el).text().includes('VEGETARISKT'))
    .first()
    .text()
    .replace('VEGETARISKT', '')
    .replace(/Mån[\s-]*(Ons|Fre)\s*:/i, '')

  // The vegetarian course is either for the whole week or split into Mån-Ons and Tors-Fre
  const vegParts = veg.split(/Tors[\s-]*Fre\s*:/i)
  const weeklyVegDesc = vegParts.length > 1 && dayAsNumber > 3 ? vegParts[1] : vegParts[0]

  if (!weeklyVegDesc?.trim()) throw new Error('Could not find the vegetarian course')

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
      desc: weeklyVegDesc.trim()
    }
  ]
}
