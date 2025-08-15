import { loadJsdomFromUrl } from '../util.js'

export const name = 'Varv'
export const url = 'https://www.varvmalmo.com/menu'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const dom = await loadJsdomFromUrl(url)
  const document = dom.window.document

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday'
  }

  const dayAsText = dayIndexToText[new Date().getDay()]

  const header =[...document.querySelectorAll('h4')]
    .find(element => element.textContent?.trim() === dayAsText)
  if (!header) throw new Error('Could not find the header for today')

  const menuItem = header?.nextElementSibling
  if (!menuItem) throw new Error('Could not find menu item element')

  return menuItem.innerHTML.split('<br>')
    .map(line => line.trim())
    .filter(line => line !== "")
    .slice(0, 2)
    .map((menuItem, i) => /** @type {Course} */ ({
      diet: i === 1 ? 'veg' : 'all',
      desc: menuItem
    }))
}
