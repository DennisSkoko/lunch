import { loadJsdomFromUrl } from '../util.js'

export const name = 'Mia Maria'
export const url = 'https://miamarias.nu/lunch/'
export const emoji = 'mia'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const dom = await loadJsdomFromUrl(url)
  const document = dom.window.document

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'Måndag',
    '2': 'Tisdag',
    '3': 'Onsdag',
    '4': 'Torsdag',
    '5': 'Fredag'
  }

  const dayAsText = dayIndexToText[new Date().getDay()]

  const button = [...document.querySelectorAll('button[aria-controls]')]
    .find(button => button.textContent?.trim() === dayAsText);
  if (!button) throw new Error('Could not find the menu button')

  const menu = document.getElementById(/** @type {string} */ (button.getAttribute('aria-controls')))
  if (!menu) throw new Error('Could not find the menu that the button pointed to')

  return extractMenuItems(menu).map((menuItem, i) => /** @type {Course} */ ({
    diet: i === 2 ? 'veg' : 'all',
    desc: menuItem
  }))
}

/**
  * @param {HTMLElement} element
  */
function extractMenuItems(element) {
  const menuItems = []

  for (const child of element.children) {
    const menuItemElement = child.children[2]
    if (!menuItemElement) throw new Error('Could not find menu item element')

    menuItems.push(menuItemElement?.textContent?.trim())
  }

  return menuItems
}
