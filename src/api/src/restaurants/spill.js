import { loadCherrioFromUrl } from '../util.js'

export const name = 'Spill'
export const url = 'https://restaurangspill.se/'
export const emoji = 'pouring_liquid'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const $ = await loadCherrioFromUrl(url)

  return $('#dagens h2:contains(Gängtappen)')
    .closest('.flex-1')
    .find('div:nth-child(3) #client .space-y-4 > div')
    .map((_i, el) => $(el).text())
    .get()
    .map(course => course.replace(/[\n]+.*/, '').trim())
    .map(course => /** @type {Course} */ ({
      diet: course.startsWith('Vegetarisk:') ? 'veg' : 'all',
      desc: course.replace('Vegetarisk:', '').trim()
    }))
}
