import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale';
import * as storage from './storage.js'

const restaurants = await storage.read()

if (!restaurants.length) {
  throw new Error('Menu is empty, can only send mail when there is at least one menu item')
}

const mailerSend = new MailerSend({ apiKey: process.env.LUNCH_EMAIL_API_KEY })

const sentFrom = new Sender(process.env.LUNCH_EMAIL_FROM_EMAIL, process.env.LUNCH_EMAIL_FROM_NAME)

const recipients = process.env.LUNCH_EMAIL_SEND_TO
  .split(',')
  .map(email => new Recipient(email.trim()))

const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(`Lunchmeny ${format(new Date(), `'v'I EEEE`, { locale: sv })}`)
    .setHtml(getEmailHtml(restaurants))
    .setText(getEmailText(restaurants))

await mailerSend.email.send(emailParams)

/**
 * @param {Restaurant[]} restaurants
 */
function getEmailHtml(restaurants) {
  const parts = []

  parts.push(`<style>
body {
  background-color: brown;
}

div {
  font-family: sans-serif;
  background-color: beige;
  padding: 2em;
  margin: 3em;
  border-radius: 1em;
}

h1 {
  margin-top: 0;
  text-align: center;
}

a {
  color: steelblue;
  text-decoration: none;
}

ul {
  margin-bottom: 2em;
}
</style>`)

  parts.push('<div>')
  parts.push(`<h1>${`Lunchmeny ${format(new Date(), `'v'I EEEE`, { locale: sv })}`}</h1>`)

  restaurants.forEach(restaurant => {
    parts.push(`<h3><a href=${restaurant.url}>${restaurant.name}</a></h3>`)

    parts.push('<ul>')

    restaurant.courses.forEach(course => {
      parts.push(`<li>${course.desc}</li>`)
    })

    parts.push('</ul>')
  })

  parts.push('</div>')

  return parts.join('')
}

/**
 * @param {Restaurant[]} restaurants
 */
function getEmailText(restaurants) {
  const textParts = [`Lunchmeny ${format(new Date(), `'v'I EEEE`, { locale: sv })}`]

  restaurants.forEach(restaurant => {
    if (restaurant.error) return;
    if (restaurant.courses.length === 0) return

    textParts.push(`<${restaurant.url}|${restaurant.name}>`)

    restaurant.courses.forEach(course => {
      textParts.push(`- ${course.desc}`)
    })

    textParts.push('\n')
  })

  return textParts.join('\n')
}
