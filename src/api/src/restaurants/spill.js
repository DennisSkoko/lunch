export const name = 'Spill'
export const url = 'https://restaurangspill.se/'

/**
 * @param {import('cheerio').CheerioAPI} $
 */
export function scrape($) {
  return $('#dagens h2:contains(Gängtappen)')
    .closest('.flex-1')
    .find('div:nth-child(3) #client .space-y-4 div')
    .map((_i, el) => $(el).text())
    .get()
    .map(course => course.replace(/\n\n.*/, '').trim())
}
