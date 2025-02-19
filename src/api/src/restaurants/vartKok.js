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

  return result.data.text
    .split('SOPPBAREN')
    .flatMap(parts => parts.split('TAKE-AWAY KYL'))
    .slice(0, 2)
    .map(part =>
      part
        .replace('\n', '&SEP&')
        .split('&SEP&')
        .filter(part => part.trim() !== '')
        .map(part => part.replaceAll('\n', ' ').replace(/(\d+)[^\d]*$/, '').trim())
    )
    .map(part => /** @type {Course} */ ({ diet: 'veg', desc: part.join(' ') }))
}
