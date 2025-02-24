import { createWorker } from 'tesseract.js'
import { loadJsdomFromUrl } from '../util.js'

export const name = 'Vårt kök (Frankful)'
export const url = 'https://www.vartkok.com/meny'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const dom = await loadJsdomFromUrl(url)
  const document = dom.window.document

  const img = document.querySelector('.wixui-image img')

  if (!img) throw new Error('Could not find the image element')

  const imageUrl = /** @type {string} */ (img.getAttribute('src'))
  const worker = await createWorker('swe')
  const result = await worker.recognize(imageUrl)
  await worker.terminate()

  return getMenuParts(result.data.text)
    .map(part =>
      part
        .replace('\n', '&SEP&')
        .split('&SEP&')
        .filter(part => part.trim() !== '')
        .map(part => part.replaceAll('\n', ' ').replace(/(\d+)[^\d]*$/, '').trim())
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

    if (line.endsWith(':-')) {
      menu.push(parts.join('\n'))
      parts = []
    }

    if (menu.length >= 2) break;
  }

  return menu
}
