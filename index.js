process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import morgan from 'morgan';
import compression from 'compression';
import bcrypt from 'bcrypt';
import cors from 'cors'

import User from './api/models/user.model.js';
import Category from './api/models/category.model.js';
import Product from './api/models/product.model.js';

import express from 'express';
import AdminBro from 'admin-bro';
import AdminBroSequelize from 'admin-bro-sequelizejs';
import AdminBroExpress from '@admin-bro/express';
import router from './api/routes/index.js'

import { checkConnection, syncModels } from './database/index.js';
import { addRelationsToModels } from './database/relations.js';

const app = express();
const port = 3000;

import db from './models/index.js'

import * as url from 'url'
// other imports

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// Filtrar header par servir archivos sin compresio
// const shouldCompress = (req, res) => {
//   if (req.headers['x-no-compression']) {
//     // No comprimira las respuestas, si este encabezado 
//     // está presente.
//     return false;
//   }
//   // Recurrir a la compresión estándar
//   return compression.filter(req, res);
// };

// Configuración de Sequelize y conexión a la base de datos

// Inicializar AdminBro
AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
  databases: [db],
  rootPath: '/admin',
  logoutPath: '/admin/exit',
  loginPath: '/admin/sign-in',
  branding: {
    companyName: 'Life Serpica',
    logo: '/static/logo.svg'
  },

  resources: [
    {
      resource: User,
      options: {
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: 'string',
            isVisible: {
              list: true, edit: true, filter: true, show: true,
            },
          },
        },
        actions: {
          login: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                  password: undefined,
                }
              }
              return request
            },
          }
        },
      },
    },
    {
      resource: Category,
      options: {
        properties: {
          encryptedPassword: { isVisible: false },
        },
      },
    },
    {
      resource: Product,
      options: {
        properties: {
          encryptedPassword: { isVisible: false },
        },
      },
    }
  ],
});

// Build and use a router which will handle all AdminBro routes
const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, encryptedPassword) => {

    const user = await User.findOne({
      where: {
        email
      }
    })

    if (user) {
      const matched = await bcrypt.compare(encryptedPassword, user.password)
      if (matched && user?.role === 'ADMIN') {
        return user
      }
    }
    return false
  },
  cookiePassword: 'superfacil',
})

// async function checkAndSyncPostgreSQL() {
//   await checkConnection()
//   addRelationsToModels()
//   await syncModels('alter')
// }

// checkAndSyncPostgreSQL();

app
  .use(adminBro.options.rootPath, adminRouter)
  .use(cors())
  .use(morgan('dev'))
  .use(compression())
  .use(express.json())
  .use('/static', express.static(path.join(__dirname, 'public')))
  .use(express.static('files'))
  .use('/api', router)
  .listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
  });
