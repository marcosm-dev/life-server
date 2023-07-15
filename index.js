// process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
require('dotenv').config()

const morgan = require('morgan')
const bcrypt = require('bcrypt')

const compression = require('compression');
const cors = require('cors')

const User = require('./api/models/user.model')
const Category = require('./api/models/category.model')
const Product = require('./api/models/product.model')

const express = require('express');
const AdminBro = require('admin-bro');
const { Router } = require('admin-bro');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const AdminBroExpress = require('@admin-bro/express');


const app = express();
const port = 3000;

const db = require('./models')

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // No comprimira las respuestas, si este encabezado 
    // está presente.
    return false;
  }
  // Recurrir a la compresión estándar
  return compression.filter(req, res);
};

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
    logo: '/assets/logo.jpg',
    favicon: '/assets/logo.jpg'
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
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, encryptedPassword) => {
    const user = await User.findOne({
      where: {
        email
      }
    })

    if (user) {
      const matched = await bcrypt.compare(encryptedPassword, user.password)
      if (matched && user?.role === 'admin') {
        return user
      }
    }
    return false
  },
  cookiePassword: 'superfacil',
})

async function checkAndSyncPostgreSQL() {
  await checkConnection()
  addRelationsToModels()
  await syncModels('alter')
}

app
  .use(adminBro.options.rootPath, router)
  .use(cors())
  .use(morgan('dev'))
  .use(compression())
  .use(express.json())
  .use('/api', require('./api/routes'))
  .listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
  });
