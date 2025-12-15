import { loadJsdomFromUrl } from '../util.js'

export const name = 'Hyllie Bryggeri'
export const url = 'https://www.hylliebryggeri.se/meny'
export const emoji = 'beer'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const dom = await loadJsdomFromUrl(url)
  const document = dom.window.document

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    1: 'Måndag',
    2: 'Tisdag',
    3: 'Onsdag',
    4: 'Torsdag',
    5: 'Fredag'
  }

  const dayText = dayIndexToText[new Date().getDay()]
  if (!dayText) throw new Error('No lunch menu on weekends.')

  // Get all visible text on the page
  const fullText = document.body.textContent
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim()

  /**
   * Match:
   *  - The current weekday
   *  - Everything until the next weekday OR end of text
   */
  const dayRegex = new RegExp(
    `${dayText}\\s*([\\s\\S]*?)(?=Måndag|Tisdag|Onsdag|Torsdag|Fredag|$)`,
    'i'
  )

  const match = fullText.match(dayRegex)
  if (!match || !match[1]) {
    throw new Error(`Could not find menu for: ${dayText}`)
  }

  const menuBlock = match[1]
  .split('\n')
  .map(l =>
    l
      .trim()
      // remove leading punctuation like ":" "–" "-"
      .replace(/^[\s:–\-.,]+/, '')
      // remove trailing punctuation
      .replace(/[\s:–\-.,]+$/, '')
  )
  .filter(Boolean)


  if (menuBlock.length === 0 || !menuBlock[0]) {
    throw new Error(`Empty menu for: ${dayText}`)
  }

  // Take only 1st line - Swedish course line
  return [{ diet: 'all', desc: menuBlock[0] }]
}
