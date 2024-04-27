import dotenv from 'dotenv'
import express, { type Express } from 'express'
dotenv.config()

import './services/cloudinary/index.js'
import { attachExpressJS } from './app.js'
import { buildAdmin } from './config/admin.js'
import connectDB from './config/db.js'

const port = process.env.PORT ?? 4000
const app: Express = express()

async function startServer(): Promise<void> {
  try {
    const db = await connectDB()
    await attachExpressJS(app)
    await buildAdmin(app, db)

    app.listen(port, () => {
      console.info(`\nYogaGraphQL Express corriendo en:\nhttp://localhost:${port}/graphql`)
      console.info(`Admin corriendo en:\nhttp://localhost:${port}/admin`)
    })
  } catch (error) {
    console.error('Error al iniciar el servidor: ', error)
  }
}
startServer()
