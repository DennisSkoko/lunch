export const name = 'Mia Maria'
export const url = 'http://www.miamarias.nu'

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

  return $(`#dagens h5:contains('${dayAsText}')`)
    .closest('.et_pb_module')
    .find('table td span')
    .map((_i, el) => $(el).text())
    .get()
    .filter(text => text.trim() !== '' && !/\d+ kr/.test(text))
}
