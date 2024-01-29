import fetch from 'node-fetch'
import { restaurants } from '../src/restaurants/index.js'
import * as storage from '../src/storage.js'

const scrapedCourses = await Promise.all(
  restaurants.map(async restaurant => {
    const response = await fetch(restaurant.url)

    if (!response.ok) {
      console.error('Failed to fetch HTML page', { url: restaurant.url })

      return {
        name: restaurant.name,
        url: restaurant.url,
        error: `Failed to make request to restaurant, got status '${response.statusText}'`
      }
    }

    try {
      const courses = await restaurant.scrape()

      return { name: restaurant.name, url: restaurant.url, courses }
    } catch (error) {
      return {
        name: restaurant.name,
        url: restaurant.url,
        error: /** @type {Error} */ (error).message
      }
    }
  })
)

await storage.write(scrapedCourses)

