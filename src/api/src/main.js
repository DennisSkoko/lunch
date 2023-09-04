import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import * as storage from './storage.js'

export function main() {
  const app = express()

  app.use(helmet())
  app.use(cors())

  app.get('/restaurants', async (_req, res, next) => {
    try {
      res.json(await storage.read())
    } catch (err) {
      next(err)
    }
  })

  app.listen(5000, () => {
    console.log('Server started')
  })
}
