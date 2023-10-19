export const name = 'Stora Varvsgatan 9'
export const url = 'https://storavarvsgatan6.se/meny.html'

/**
 * @param {import('cheerio').CheerioAPI} $
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

  return Array.from({ length: 2 }, () => {
    currentNode = currentNode.next()
    return currentNode.text().replace(/.*: /, '')
  })
}
