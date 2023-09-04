export const name = 'P2'
export const url = 'https://www.restaurangp2.se/lunch'

/**
 * @param {import('cheerio').CheerioAPI} $
 */
export function scrape($) {
  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'monday',
    '2': 'tuesday',
    '3': 'wednesday',
    '4': 'thursday',
    '5': 'friday',
  }

  const dayAsText = dayIndexToText[new Date().getDay()]

  return $(`#${dayAsText} .course_description > p`)
    .map((_i, el) => $(el).text())
    .get()
}
