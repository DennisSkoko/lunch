import puppeteer from 'puppeteer'
import { restaurants } from '../src/restaurants/index.js'
import * as storage from '../src/storage.js'

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
})

const scrapedData = []

for (const restaurant of restaurants) {
  const page = await browser.newPage()
  
  try {
    scrapedData.push(await restaurant.scrape(page))
  } catch (error) {
    console.error(error)
  }

  await page.close()
}

await storage.write(scrapedData)
await browser.close()
