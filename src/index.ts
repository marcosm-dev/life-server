import * as dotenv from 'dotenv'
dotenv.config()
import express, { type Express } from 'express'

import { attachExpressJS, attachAdminJS, attachGraphQLYoga } from './app.js'

import './services/cloudinary/index.js'

const port = process.env.PORT ?? 8080

const app: Express = express()

async function start(): Promise<void> {
  await attachExpressJS(app)
  await attachAdminJS(app)
  await attachGraphQLYoga(app)

  app.listen(port, () => {
    console.info(
      `\nYogaGraphQL Express corriendo en:\nhttp://localhost:${port}/graphql`
    )
    console.info(`Admin corriendo en:\nhttp://localhost:${port}/admin`)
  })
}
start()
