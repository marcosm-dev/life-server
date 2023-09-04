import * as dotenv from 'dotenv'
import express, { type Express } from 'express'

import { attachExpressJS, attachAdminJS, attachGraphQLYoga } from './app.js'

import './services/cloudinary/index.js'
dotenv.config()

const PORT = process.env.PORT ?? 4000

const app: Express = express()

async function start(): Promise<void> {
  await attachExpressJS(app)
  await attachAdminJS(app)
  await attachGraphQLYoga(app)

  app.listen(PORT, () => {
    console.info(
      `\nYogaGraphQL Express corriendo en:\nhttp://localhost:${PORT}/graphql`
    )
    console.info(`Admin corriendo en:\nhttp://localhost:${PORT}/admin`)
  })
}

await start()
