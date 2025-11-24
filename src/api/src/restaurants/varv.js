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
    '1': 'monday',
    '2': 'tuesday',
    '3': 'wednesday',
    '4': 'thursday',
    '5': 'friday'
  }

  const dayAsText = dayIndexToText[new Date().getDay()]

  const header =[...document.querySelectorAll('h2')]
    .find(element => element.textContent?.trim().toLowerCase() === dayAsText)
  if (!header) throw new Error('Could not find the header for today')

  const firstMenuItem = header?.nextElementSibling
  if (!firstMenuItem) throw new Error('Could not find the first menu item element')

  const secondMenuItem = header?.nextElementSibling?.nextElementSibling?.nextElementSibling
  if (!secondMenuItem) throw new Error('Could not find the second menu item element')

  return [firstMenuItem, secondMenuItem]
    .map(el => el.textContent?.trim())
    .filter(line => !!line)
    .map((menuItem, i) => /** @type {Course} */ ({
      diet: i === 1 ? 'veg' : 'all',
      desc: menuItem
    }))
  
  // const menuItem = header?.nextElementSibling
  // if (!menuItem) throw new Error('Could not find the menu item element')

  // return menuItem?.innerHTML
  //   .replaceAll('<br>', '\n')
  //   .replaceAll('<em>or</em>', '\n')
  //   .split('\n')
  //   .filter(line => line.trim())
  //   .map((menuItem, i) => /** @type {Course} */ ({
  //     diet: i === 1 ? 'veg' : 'all',
  //     desc: menuItem
  //   }))
}
