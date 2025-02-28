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
    /** @type {import('@slack/web-api').KnownBlock[]} */
    const blocks = [{
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Today\'s menu'
      }
    }]

    restaurants.forEach(restaurant => {
      if (restaurant.error) return;

      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${restaurant.url}|${restaurant.name}>`
        }
      })

      if (restaurant.courses.length !== 0) {
        blocks.push({
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_list',
              style: 'bullet',
              elements: restaurant.courses.map(course => ({
                type: 'rich_text_section',
                elements: [
                  // {
                  //   type: 'emoji',
                  //   name: course.diet === 'all' ? 'cut_of_meat' : 'broccoli'
                  // },
                  {
                    type: 'text',
                    text: ` ${course.desc}`
                  }
                ]
              }))
            }
          ]
        })
      }
    })

    const textParts = ['Today\'s menu']

    restaurants.forEach(restaurant => {
      if (restaurant.error) return;
      if (restaurant.courses.length === 0) return

      textParts.push(`<${restaurant.url}|${restaurant.name}>`)

      restaurant.courses.forEach(course => {
        textParts.push(`- ${course.desc}`)
      })

      textParts.push('\n')
    })

    await this.#slack.chat.postMessage({
      channel: process.env.LUNCH_SLACK_CHANNEL,
      unfurl_links: false,
      text: textParts.join('\n'),
      blocks: blocks
    })

  }
}
