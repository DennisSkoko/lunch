import { loadJsdomFromUrl } from '../util.js'

export const name = 'Mia Maria'
export const url = 'https://miamarias.nu/lunch/'
export const emoji = 'mia'

export function hasMenuToday() {
  return true
}

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

  /** @type {Course[]} */
  const courses = []
  let label = ''

  // Each course is a container with a label, an empty spacer, the dish and the price. Some days
  // the label is a separate heading before the container, and some days have extra courses
  // like "Torsdagens soppa"
  for (const child of todaysWrapper.children) {
    const parts = [...child.children].map(el => el.textContent?.trim() ?? '')

    if (!child.classList.contains('e-con')) {
      label = /** @type {string} */ (child.textContent?.trim())
      continue
    }

    if (parts.length > 3) label = /** @type {string} */ (parts[0])

    const desc = parts[parts.length - 2]
    if (desc) courses.push({ diet: /vegetari/i.test(label) ? 'veg' : 'all', desc })
  }

  if (courses.length === 0) throw new Error('Could not find todays menu')

  return courses
}
