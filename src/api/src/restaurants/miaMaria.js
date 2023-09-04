/**
 * @param {import('puppeteer').Page} page
 */
export async function scrape(page) {
  page.setDefaultTimeout(100000)
  await page.mainFrame().goto('http://www.miamarias.nu', { waitUntil: 'domcontentloaded', timeout: 90000 })

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
  	const block = [...document.body.querySelectorAll('#dagens .et_pb_row_2 > div > div')].find(el => el.innerText.includes(dayAsText))
    
    return [...block.querySelectorAll('table tr td span')]
    	.map(el => el.innerText)
    	.filter(innerText => innerText !== '' && !/\d+ kr/.test(innerText))
  })

  return {
    restaurant: 'Mia Maria',
    courses
  }
}
