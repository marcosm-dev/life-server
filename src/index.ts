import dotenv from 'dotenv'
dotenv.config({ path: `${process.cwd()}/.env`})
import express, { Express } from 'express'

const PORT = process.env.PORT || 4000

// const { attachExpressJS  } = await import('./app.js')
const { attachExpressJS, attachGraphQLYoga } = await import('./app.js')

// import './services/factura-directa.js'
const start = async () => {
  const app: Express = express()
  await attachExpressJS(app)
  await attachGraphQLYoga(app)

  
  app
  .listen(PORT, () => {
    console.info(`\nYogaGraphQL Express corriendo en:\nhttp://localhost:${PORT}/graphql`)
    console.info(`Admin corriendo en:\nhttp://localhost:${PORT}/admin`)
  })
}

start()
