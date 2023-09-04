import fetch from 'node-fetch'
import { load } from 'cheerio'
import { restaurants } from '../src/restaurants/index.js'
import * as storage from '../src/storage.js'

const scrapedCourses = []

for (const restaurant of restaurants) {
  const response = await fetch(restaurant.url)

  if (!response.ok) {
    console.log('Failed to fetch HTML page', { url: restaurant.url })
    continue
  }

  const $ = load(await response.text())
  const courses = restaurant.scrape($)
  scrapedCourses.push({ name: restaurant.name, courses })
}

await storage.write(scrapedCourses)

