export const name = 'Ubåtshallen'
export const url = 'https://www.ubatshallen.se'

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

  const section = $(`.entry-content .wp-block-group strong:contains(${dayAsText})`)
    .closest('.wp-block-group')
    .find('p:last-child')
    .first()
    
  section.find('br').replaceWith('\n')

  return section
    .text()
    .split('\n')
    .filter(desc => desc.trim() !== '')
    .map((desc, i) => ({
      diet: i === 0 ? 'veg' : 'all',
      desc: /** @type {string} */ (desc.split(': ').pop()),
    }))
}
