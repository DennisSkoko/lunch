import { WebClient } from '@slack/web-api'

export class Slack {
  /**
   * @type {import('@slack/web-api').WebClient}
   */
  #slack

  /**
   * @param {string} token
   */
  constructor(token) {
    this.#slack = new WebClient(token)
  }

  /**
   * @param {Restaurant[]} restaurants 
   */
  async writeToChannel(restaurants) {
    const textParts = ['Today\'s menu is:']

    restaurants.forEach(restaurant => {
      if (restaurant.error) return;
      if (restaurant.courses.length === 0) return

      textParts.push(`  •   <${restaurant.url}|${restaurant.name}>`)

      restaurant.courses.forEach(course => {
        textParts.push(`        •   ${course}`)
      })
    })

    await this.#slack.chat.postMessage({
      channel: process.env.LUNCH_SLACK_CHANNEL,
      unfurl_links: false,
      text: textParts.join('\n')
    })
  }
}
