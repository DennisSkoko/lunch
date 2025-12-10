import { loadJsdomFromUrl } from '../util.js'

export const name = 'Välfärden'
export const url = 'https://valfarden.nu/dagens-lunch/'
export const emoji = 'fork_and_knife'

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

  // pick the container that has <b> elements (the menu)
  const containers = document.querySelectorAll('.elementor-widget-container')
  const container = [...containers].find(c => c.querySelector('b'))
  if (!container) throw new Error('Could not find menu container')

  const pTags = [...container.querySelectorAll('p')]
  let todayDishes = []
  let collecting = false

  /**
   * @param {string} str
   * @returns {string}
   */
  const normalize = (str) =>
    str.replace(/\s+/g, ' ').replace(/\u00A0/g, ' ').trim()

  for (const p of pTags) {
    const bold = p.querySelector('b')
    if (bold) {
      const dayName = normalize(bold.textContent).split(' ')[0] // only the weekday
      if (dayName === todayText) {
        collecting = true
        continue
      } else if (collecting) {
        break // reached next weekday
      }
    }

    if (collecting) {
      const spans = [...p.querySelectorAll('span')]
      for (const span of spans) {
        const dish = normalize(span.textContent)
        if (dish) todayDishes.push(dish)
      }
    }
  }

  if (todayDishes.length === 0) {
    throw new Error(`No dishes found for ${todayText}`)
  }

  return todayDishes.map((desc, i) => ({
    diet: i % 2 === 1 ? 'veg' : 'all',
    desc
  }))
}
