// import { JSDOM } from 'jsdom'
// import fetch from 'node-fetch'

export const name = 'Eatery'
export const url = 'https://eatery.se/anlaggningar/vastra-hamnen'
export const emoji = 'eatery'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  // const response = await fetch('https://api.eatery.se/wp-json/eatery/v1/load')

  // if (!response.ok) {
  //   throw new Error('Non ok response code from eatery')
  // }

  // /** @type {{ [key: string]: string }} */
  // const dayIndexToText = {
  //   '1': 'MÅNDAG',
  //   '2': 'TISDAG',
  //   '3': 'ONSDAG',
  //   '4': 'TORSDAG',
  //   '5': 'FREDAG'
  // }

  // const dayAsText = dayIndexToText[new Date().getDay()]

  // const data = /** @type {any} */ (await response.json())
  // const menuId = data.eateries['/vastra-hamnen'].menues.lunchmeny
  // const dom = new JSDOM(data.menues[menuId].content.content)
  // const document = dom.window.document

  // /** @type {Element | null | undefined} */
  // let cursor = Array.from(document.querySelectorAll('h2, strong')).find(header => {
  //   return header.textContent === dayAsText
  // })

  // if (!cursor) throw new Error('Did not find header with todays day name')

  // if (cursor.parentElement?.lastElementChild === cursor) {
  //   cursor = cursor.parentElement.nextElementSibling?.firstElementChild
  // } else {
  //   cursor = cursor.nextElementSibling
  // }

  // const courses = [
  //   cursor?.textContent,
  //   cursor?.nextElementSibling?.textContent,
  //   cursor?.nextElementSibling?.nextElementSibling?.textContent
  // ]

  // const weeklySalladCursor = Array.from(document.querySelectorAll('strong'))
  //   .find(el => el.textContent?.toLowerCase().includes('veckans sallad'))

  // if (weeklySalladCursor) {
  //   // const weeklySallad = weeklySalladCursor.parentElement?.nextElementSibling?.textContent?.trim()
  //   // if (weeklySallad) courses.push(weeklySallad)
  //   // else {
  //     let inlineWeeklySallad = weeklySalladCursor.parentElement?.textContent
  //       ?.replace('Veckans sallad', '')
  //       .replace(':', '')
  //       .trim()

  //     if (inlineWeeklySallad) courses.push(inlineWeeklySallad)
  //   // }
  // }

  // return courses
  //   .map(desc => desc?.trim())
  //   .map((desc, i) => {
  //     if (!desc) {
  //       throw new Error('Scraped invalid course')
  //     }

  //     return { diet: i === 2 ? 'veg' : 'all', desc }
  //   })

  return [
    { diet: 'all', desc: 'Klicka på länken och kolla själv' }
  ]
}
