export const name = 'Ubåtshallen'
export const url = 'https://www.ubatshallen.se'

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

  return $(`.entry-content .wp-block-group strong:contains(${dayAsText})`)
    .closest('.wp-block-group')
    .find('p')
    .map((_i, el) => $(el).text())
    .get()
    .filter(text => text !== '')
    .slice(1, 3)
}
