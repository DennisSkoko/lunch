/**
 * @param {import('puppeteer').Page} page
 */
export async function scrape(page) {
  await page.goto('https://www.ubatshallen.se')

  const courses = await page.evaluate(() => {
    const day = new Date().getDay()

    /** @type {{ [key: string]: string }} */
  	const dayIndexToText = {
      '1': 'Måndag',
      '2': 'Tisdag',
      '3': 'Onsdag',
      '4': 'Torsdag',
      '5': 'Fredag'
    }

    const dayAsText = dayIndexToText[day]

    const blockGroup = [...document.body.querySelectorAll(`
      .entry-content .wp-block-group
    `)].find(el => el.innerText.includes(dayAsText))
    
    const paragraphs = [...blockGroup.querySelectorAll('p')].filter(el => el.innerText !== '')
    
    return [paragraphs[1].innerText, paragraphs[2].innerText]
  })

  return {
    restaurant: 'Ubåtshallen',
    courses
  }
}
