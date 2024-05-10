import dotenv from 'dotenv'
import express, { type Express } from 'express'
dotenv.config()

import './services/cloudinary/index.js'
import { attachExpressJS } from './app.js'
import { buildAdmin } from './config/admin.js'
import connectDB from './config/db.js'
import { scheduleCronJobs } from './crons/cronRunner.js'

const port = process.env.PORT ?? 4000
const app: Express = express()

async function startServer(): Promise<void> {
  try {
    const db = await connectDB()
    await attachExpressJS(app)
    await buildAdmin(app, db)
    scheduleCronJobs() // Iniciar la tarea cron
    
    app.set('view engine', 'handlebars')
    app.set('templates', './templates/email')
    app.listen(port, () => {
      console.info(
        `\nYogaGraphQL Express corriendo en:\nhttp://localhost:${port}/graphql`
      )
      console.info(`Serpica CMS corriendo en:\nhttp://localhost:${port}`)
    })
  } catch (error) {
    console.error('Error al iniciar el servidor: ', error)
  }
}
startServer()
