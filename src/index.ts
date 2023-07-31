import dotenv from 'dotenv'
import express from 'express'

const PORT = process.env.PORT || 4000
import { attachAdminJS, attachExpressJS, attachGraphQLYoga } from './app.js'
import { prisma } from './prisma/config.js'

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

dotenv.config({
  path: `${process.cwd()}/.env`,
})

start()
  .finally(async () => {
      await prisma.$disconnect()
  })

