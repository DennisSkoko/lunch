import { loadJsdomFromUrl } from '../util.js'

export const name = 'Ubåtshallen'
export const url = 'https://www.ubatshallen.se'

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

  const dayAsText = /** @type {string} */ (dayIndexToText[new Date().getDay()])

  const header = Array.from(document.querySelectorAll('.entry-content .wp-block-group strong'))
    .find(header => header.textContent?.includes(dayAsText))
  if (!header) throw new Error('Could not find the header element')

  const wrapper = header.closest('.wp-block-group')

  if (!wrapper) throw new Error('Could not find the wrapper element')

  header.remove()
  wrapper.innerHTML = wrapper.innerHTML.replaceAll('<br>', '\n')
  
  const courses = wrapper?.textContent
    ?.split('\n')
    .filter(line => line.trim() !== '')
    .slice(0, 3)
    .map(line => /** @type {string} */ (line.split(':').pop()?.trim()))

  if (!courses) throw new Error('Failed to get the courses')

  const weeklySalladHeader = Array.from(document.querySelectorAll('.entry-content .wp-block-group strong'))
    .find(header => header.textContent?.toLowerCase().includes("veckans sallad"))
  if (!weeklySalladHeader) throw new Error('Could not find the weekly sallad element')

  const weeklySallad = weeklySalladHeader.parentElement?.textContent?.split(':').pop()?.trim()

  if (weeklySallad) {
    courses?.push(weeklySallad)
  }

  return courses.map((course, i) => ({ diet: i === 0 ? 'veg' : 'all', desc: course }))
}
