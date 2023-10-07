export const name = 'Spill'
export const url = 'https://restaurangspill.se/'

/**
 * @param {import('cheerio').CheerioAPI} $
 */
export function scrape($) {
  return $('#dagens h2:contains(Gängtappen)')
    .closest('.flex-1')
    .find('div:nth-child(3) #static .space-y-4 div div')
    .map((_i, el) => $(el).text())
    .get()
    .slice(1)
    .map(course => course.replace(/\n\n.*/, '').trim())
}
