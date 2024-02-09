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
    '1': 'MÅNDAG',
    '2': 'TISDAG',
    '3': 'ONSDAG',
    '4': 'TORSDAG',
    '5': 'FREDAG'
  }

  const dayAsText = /** @type {string} */ (dayIndexToText[new Date().getDay()])

  /** @type {Course} */
  const weeklyVeg = {
    diet: 'veg',
    desc: $('[title="Page 1"] p:last-child').text().replace('VECKANS VEGETARISKA', '').trim()
  }

  if (dayAsText === 'MÅNDAG') {
    return [
      {
        diet: 'all',
        desc: $(`[title="Page 1"] p:nth-child(2)`).text()
      },
      weeklyVeg
    ]
  }

  return [
    {
      diet: 'all',
      desc: $(`[title="Page 1"] strong:contains("${dayAsText}")`)
        .closest('p')
        .text()
        .replace(dayAsText, '')
    },
    weeklyVeg
  ]
}
