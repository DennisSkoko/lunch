import { loadCherrioFromUrl } from '../util.js'

export const name = 'Mia Maria'
export const url = 'http://www.miamarias.nu'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const $ = await loadCherrioFromUrl(url)

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'Måndag',
    '2': 'Tisdag',
    '3': 'Onsdag',
    '4': 'Torsdag',
    '5': 'Fredag'
  }

  const dayAsText = dayIndexToText[new Date().getDay()]

  return $(`#dagens h5:contains('${dayAsText}')`)
    .closest('.et_pb_module')
    .find('table td p')
    .map((_i, el) => $(el).text().trim())
    .get()
    .filter(text => text.trim() !== '' && !/\d+ kr/.test(text))
    .map((desc, i) => ({ diet: i === 2 ? 'veg' : 'all', desc }))
}
