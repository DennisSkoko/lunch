export const name = 'Stora Varvsgatan 6'
export const url = 'https://storavarvsgatan6.se/meny.html'

/**
 * @param {import('cheerio').CheerioAPI} $
 * @returns {Course[]}
 */
export function scrape($) {
  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'Måndag',
    '2': 'Tisdag',
    '3': 'Onsdag',
    '4': 'Torsdag',
    '5': 'Fredag'
  }

  const dayAsText = dayIndexToText[new Date().getDay()]
  let currentNode = $(`p:contains('${dayAsText}')`)

  const result = Array
    .from({ length: 2 }, (_, i) => {
      currentNode = currentNode.next()

      return {
        diet: i === 1 ? 'veg' : 'all',
        desc: currentNode.text().replace(/.*: /, '')
      }
    })
    .filter(course => course.desc.trim() !== '')

  return /** @type {Course[]} **/ (result)
}
