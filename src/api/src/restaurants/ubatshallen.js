import { loadJsdomFromUrl } from '../util.js'

export const name = 'Ubåtshallen'
export const url = 'https://www.ubatshallen.se'
export const emoji = 'submarine'

export function hasMenuToday() {
  return true
}

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

  const content = document.querySelector('.entry-content')
  if (!content) throw new Error('Could not find the menu element')

  // The day headers are sometimes at the end of the previous paragraph, so read the menu line by line
  content.innerHTML = content.innerHTML.replace(/<br\s*\/?>|<\/p>/g, '\n')
  const lines = /** @type {string} */ (content.textContent)
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(line => line !== '')

  const headerIndex = lines.findIndex(line => line === dayAsText)
  if (headerIndex === -1) throw new Error('Could not find the header for today')

  // Every course is labeled, e.g. "Det gröna: …", "Husman: …" or "Internationell: …"
  const courses = lines
    .slice(headerIndex + 1, headerIndex + 4)
    .filter(line => line.includes(':'))
    .map(line => /** @type {Course} */ ({
      diet: /^det gröna/i.test(line) ? 'veg' : 'all',
      desc: /** @type {string} */ (line.split(':').pop()?.trim())
    }))

  if (courses.length === 0) throw new Error('Failed to get the courses')

  const weeklySallad = Array.from(document.querySelectorAll('.entry-content p'))
    .find(header => header.textContent?.toLowerCase().includes("veckans sallad"))
  if (!weeklySallad) throw new Error('Could not find the weekly sallad element')

  const weeklySalladText = weeklySallad.textContent?.split(':').pop()?.trim()

  if (weeklySalladText) {
    courses?.push({ diet: 'all', desc: weeklySalladText })
  }

  return courses
}
