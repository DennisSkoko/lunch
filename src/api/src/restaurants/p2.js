
/**
 * @param {import('puppeteer').Page} page
 */
export async function scrape(page) {
  await page.goto('https://www.restaurangp2.se/lunch')

  const courses = await page.evaluate(() => {
    /** @type {{ [key: string]: string }} */
    const dayIndexToText = {
      '1': 'monday',
      '2': 'tuesday',
      '3': 'wednesday',
      '4': 'thursday',
      '5': 'friday',
    }
  
    const dayAsText = dayIndexToText[new Date().getDay()]

    return [...document.body.querySelectorAll(`#${dayAsText} .course_description > p`)]
      .map(el => el.textContent)
  })

  return {
    restaurant: 'P2',
    courses
  }
}
