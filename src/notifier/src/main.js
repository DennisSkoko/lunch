import { Slack } from './api.js'
import { read } from './storage.js'

const slack = new Slack(process.env.LUNCH_SLACK_TOKEN)

const restaurants = await read()
await slack.writeToChannel(restaurants)
