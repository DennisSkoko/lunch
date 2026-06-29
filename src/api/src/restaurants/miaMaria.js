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

  const wrapper = [...document.querySelectorAll('[role="tabpanel"]')]
    .find(el => el.id.includes('lunch-meny'))
    ?.parentElement

  if (!wrapper) throw new Error('Could not find wrapper')

  const todaysWrapper = wrapper.children[new Date().getDay() - 1]
  if (!todaysWrapper) throw new Error('Could not find todays wrapper')

  return new Array(3).fill(null).map((_, i) => {
    const inner = todaysWrapper.children[i]?.children[2]

    if (!inner) throw new Error('Could not find todays menu')

    return { diet: i === 2 ? 'veg' : 'all', desc: /** @type {string} */ (inner.textContent?.trim()) }
  })
}
