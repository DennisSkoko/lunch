import { loadJsdomFromUrl } from '../util.js'

export const name = 'Vårt kök (Frankful)'
export const url = 'https://www.vartkok.com/meny'
export const emoji = 'tele2_frank'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const dom = await loadJsdomFromUrl(url)
  const document = dom.window.document

  const wrapper = document.querySelectorAll('[data-testid="richTextElement"]')[5]

  if (!wrapper?.textContent) {
    throw new Error('Failed to find richTextElement from Vårt Kök')
  }

  return getMenuParts(wrapper.textContent)
    .map(part =>
      part
        .split('\n')
        .map(part => part.replace(/(\d+)[^\d]*$/, '').trim())
        .map(part => part.split('').filter(c => c.charCodeAt(0) !== 8203).join('').trim())
        .filter(part => part !== '')
    )
    .map(part => /** @type {Course} */ ({ diet: 'veg', desc: part.join(' ') }))
}

/**
 * @param {string} text
 */
function getMenuParts(text) {
  let parts = []
  const menu = []

  for (const line of text.split('\n')) {
    parts.push(line)

    if (line.includes(':-')) {
      menu.push(parts.join('\n'))
      parts = []
    }

    if (menu.length >= 2) break;
  }

  return menu
}
