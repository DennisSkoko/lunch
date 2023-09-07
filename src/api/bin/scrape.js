import fetch from 'node-fetch'
import { load } from 'cheerio'
import { restaurants } from '../src/restaurants/index.js'
import * as storage from '../src/storage.js'

const scrapedCourses = await Promise.all(
  restaurants.map(async restaurant => {
    const response = await fetch(restaurant.url)

    if (!response.ok) {
      console.error('Failed to fetch HTML page', { url: restaurant.url })
      return null
    }

    const $ = load(await response.text())
    const courses = restaurant.scrape($)

    return { name: restaurant.name, url: restaurant.url, courses }
  })
)

await storage.write(scrapedCourses.filter(courses => courses !== null))

