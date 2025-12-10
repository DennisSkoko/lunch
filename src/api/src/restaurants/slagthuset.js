import { loadJsdomFromUrl } from '../util.js'

export const name = 'Slagthuset Restaurangen'
export const url = 'https://www.slagthuset.se/restaurangen'
export const emoji = 'fork_and_knife'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const dom = await loadJsdomFromUrl(url)
  const document = dom.window.document

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    1: 'Måndag',
    2: 'Tisdag',
    3: 'Onsdag',
    4: 'Torsdag',
    5: 'Fredag'
  }

  const todayText = dayIndexToText[new Date().getDay()]
  if (!todayText) throw new Error('No lunch menu on weekends')

  // All day blocks
  const dayBlocks = document.querySelectorAll(
    'div.flex.flex-col.gap-2.justify-center.items-center'
  )

  let dish = null
  for (const block of dayBlocks) {
    const dayName = block.querySelector('b')?.textContent?.trim()
    const description = block.querySelector('div.italic')?.textContent?.trim()

    if (dayName === todayText && description) {
      dish = description
      break
    }
  }

  if (!dish) throw new Error(`Could not find menu for ${todayText}`)

  return [
    {
      diet: 'all', // you can adjust if you detect veg somehow
      desc: dish
    }
  ]
}
