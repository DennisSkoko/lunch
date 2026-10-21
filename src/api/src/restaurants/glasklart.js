import { loadJsdomFromUrl } from '../util.js'

export const name = 'Glasklart'
export const url = 'https://glasklart.eu/sv/startsida/'
export const emoji = 'cocktail'

export function hasMenuToday() {
  const date = new Date()

  return date.getDay() !== 5 && date.toLocaleDateString('sv') !== '2026-10-22'
}

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const dom = await loadJsdomFromUrl(url)
  const document = dom.window.document
  /** @type {Course[]} */
  const courses = []

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'måndag',
    '2': 'tisdag',
    '3': 'onsdag',
    '4': 'torsdag'
  }

  const dayAsText = /** @type {string} */ (dayIndexToText[new Date().getDay()])

  const wrapper = document.querySelector('[role="main"]')
  if (!wrapper) throw new Error('Could not find main wrapper')

  const headers = wrapper.querySelectorAll('h4')

  for (const header of headers) {
    const headerText = header.textContent?.toLowerCase()

    if (headerText === dayAsText) {
      const desc = header.nextElementSibling?.textContent
      if (!desc) throw new Error('No course under the header of todays menu')

      courses.push({ diet: 'all', desc })
    }

    if (headerText === 'veckans vegetariska') {
      const desc = header.nextElementSibling?.textContent
      if (!desc) throw new Error('No course under the header of todays menu')

      courses.push({ diet: 'veg', desc })
    }
  }

  return courses
}
