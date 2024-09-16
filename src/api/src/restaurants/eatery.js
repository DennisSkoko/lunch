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
  const cursor = $(`h2 *:contains(${dayAsText})`).parent()

  const courses = [
    cursor.next().text(),
    cursor.next().next().text(),
    cursor.next().next().next().text(),
    $(`p:contains("Veckans sallad")`).text().replace('Veckans sallad:', '').trim()
  ]

  if (dayAsText === 'TISDAG' || dayAsText === 'TORSDAG') {
    const extraCourse = cursor.next().next().next().next().text()
    courses.push(extraCourse.replace('Sweet Tuesday:', '').replace('Pancake Thursday:', '').trim())
  }

  return courses.map((desc, i) => ({ diet: i === 0 ? 'veg' : 'all', desc }))
}
