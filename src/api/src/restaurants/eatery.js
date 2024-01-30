import { load } from 'cheerio'
import fetch from 'node-fetch'

export const name = 'Eatery'
export const url = 'https://eatery.se/vastra-hamnen/lunchmeny'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const response = await fetch('https://api.eatery.se/wp-json/eatery/v1/load')

  if (!response.ok) {
    throw new Error('Non ok response code from eatery')
  }

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'MÅNDAG',
    '2': 'TISDAG',
    '3': 'ONSDAG',
    '4': 'TORSDAG',
    '5': 'FREDAG'
  }

  const dayAsText = dayIndexToText[new Date().getDay()]

  const data = /** @type {any} */ (await response.json())
  const menuId = data.eateries['/vastra-hamnen'].menues.lunchmeny
  const $ = load(data.menues[menuId].content.content)

  const courses = $(`h2 b:contains(${dayAsText})`).parent().next().text().split('\n')
  const sallad = $(`h2 strong:contains("Veckans sallad: ")`).parent().next().text()

  return [...courses, sallad]
    .map(course => course.replace('Sweet Tuesday:', '').replace('Pancake Thursday:', '').trim())
    .map((desc, i) => ({ diet: i === 0 ? 'veg' : 'all', desc }))
}
