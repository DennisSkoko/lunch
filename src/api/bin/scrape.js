import fetch from 'node-fetch'
import { restaurants } from '../src/restaurants/index.js'
import * as storage from '../src/storage.js'
import { retry } from '../src/util.js'

const scrapedRestaurants = await Promise.all(
  restaurants.map(async restaurant => {
    try {
      const courses = await retry(async () => await restaurant.scrape())

      return { name: restaurant.name, url: restaurant.url, emoji: restaurant.emoji, courses }
    } catch (error) {
      return {
        name: restaurant.name,
        url: restaurant.url,
        emoji: restaurant.emoji,
        error: /** @type {Error} */ (error).message
      }
    }
  })
)

const failedRestaurants = scrapedRestaurants.filter(
  restaurant => restaurant.error || restaurant.courses?.length === 0
)

if (process.env.NTFY_URL && failedRestaurants.length > 0) {
  console.log('Some restaurants failed to scrape, will send notification')

  let message = ''

  failedRestaurants.forEach(failedRestaurant => {
    message += `- [${failedRestaurant.name}](${failedRestaurant.url}) - ${failedRestaurant.error || 'No courses found'}\n`
  })

  const response = await fetch(process.env.NTFY_URL, {
    method: 'POST',
    body: message,
    headers: {
      Title: 'Some restaurants failed to scrape',
      Authorization: `Bearer ${process.env.NTFY_TOKEN}`,
      Markdown: 'yes'
    }
  })

  if (!response.ok) {
    console.error('Failed to report the errors')
    console.error(failedRestaurants)
  }
}

await storage.write(scrapedRestaurants)
