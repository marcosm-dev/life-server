process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
import express from 'express'

import { rootPath, adminRouter } from './admin/admin.js'
import { buildApp } from './app.js'
import './database/index.js'

const PORT = process.env.PORT || 4000
const app = express()
const graphqlPath = buildApp(app)

app
  .use(rootPath, adminRouter)
  .listen(PORT, () => {
    
  console.info(`\nYogaGraphQL Express corriendo en:\nhttp://localhost:${PORT}${graphqlPath}`)
  console.info(`Admin corriendo en:\nhttp://localhost:${PORT}${rootPath}`)
})
