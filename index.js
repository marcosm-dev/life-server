process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
require('dotenv').config()

const { checkConnection, syncModels } = require('./database/index')
const addRelationsToModels = require('./database/relations')

const compression = require('compression');
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

async function checkAndSyncPostgreSQL() {
  await checkConnection()
  addRelationsToModels()
  await syncModels('alter')
}

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // No comprimira las respuestas, si este encabezado 
    // está presente.
    return false;
  }
  // Recurrir a la compresión estándar
  return compression.filter(req, res);
};

function initializeAndListenWithExpress() {

  const app = express();

  app.use(compression({
    // filter: Decide si la respuesta debe comprimirse o no,
    // en función de la función 'shouldCompress' anterior
    filter: shouldCompress,
    // threshold: Es el umbral de bytes para el tamaño del cuerpo
    // de la respuesta antes de considerar la compresión,
    // el valor predeterminado es 1 kB
    threshold: 0
  }))
    .use(cors())
    .use(morgan('dev'))
    .use(express.json())
    .use('/api', require('./api/routes'))
    .listen(process.env.PORT, () => {
      console.log(`> Listening on port: ${process.env.PORT}`)
    })
}

async function startAPI() {
  await checkAndSyncPostgreSQL()
  initializeAndListenWithExpress()
}

startAPI()
