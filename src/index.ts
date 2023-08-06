import dotenv from 'dotenv'
dotenv.config({ path: `${process.cwd()}/.env`})
import express from 'express'

const PORT = process.env.PORT || 4000
import { attachAdminJS, attachExpressJS, attachGraphQLYoga } from './app.js'

import './services/factura-directa.js'

const start = async () => {
  const app = express()
  await attachExpressJS(app)
  await attachAdminJS(app)
  await attachGraphQLYoga(app)
  
  app
    .listen(PORT, () => {
      console.info(`\nYogaGraphQL Express corriendo en:\nhttp://localhost:${PORT}/graphql`)
      console.info(`Admin corriendo en:\nhttp://localhost:${PORT}/admin`)
    })
  }

start()
