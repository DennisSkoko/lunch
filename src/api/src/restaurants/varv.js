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

  const grid = document.querySelector('.fluid-engine')
  if (!grid) throw new Error('Could not find the grid layout element')

  const header =[...grid.querySelectorAll('h4')]
    .find(element => element.textContent?.trim() === dayAsText)
  if (!header) throw new Error('Could not find the header for today')

  const headerWrapper = header.parentElement?.parentElement?.parentElement?.parentElement
  const menuItem = headerWrapper?.nextElementSibling?.querySelector('.sqs-html-content > h1')

  if (!menuItem) throw new Error('Could not find menu item element')

  return menuItem.innerHTML.split('<br>or<br>')
    .map((menuItem, i) => /** @type {Course} */ ({
      diet: i === 1 ? 'veg' : 'all',
      desc: menuItem.trim()
    }))
    .map(menuItem => {
      const temp = document.createElement('div')
      temp.innerHTML = menuItem.desc
      menuItem.desc =  /** @type {string} */ (temp.textContent)

      return menuItem
    })
}
