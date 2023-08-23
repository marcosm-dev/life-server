import * as dotenv from 'dotenv';
dotenv.config();

import AdminJS from 'adminjs';

import express, { Express } from 'express';
import session, { SessionOptions } from 'express-session';
import compression from 'compression';
import cors from 'cors';
import { Database, Resource } from '@adminjs/mongoose';
import { generateAdminJSConfig } from './admin/index.js';

import { createYoga } from 'graphql-yoga';
import { logger } from './graphql/logger.js';
import { createContext } from './graphql/context.js';
import { schema } from './graphql/schema.js';

// // import { fileURLToPath } from 'url'
// // import path from 'path'
import { adminJSRouter } from './admin/router.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessionOptions: SessionOptions = {
  secret: process.env.SECRET || 'secretpassword',
  resave: false,
  saveUninitialized: false,
};

export const attachAdminJS = async (app: Express) => {
  const config = await generateAdminJSConfig();
  AdminJS.registerAdapter({ Database, Resource });
  const adminJS = new AdminJS(config);

  if (process.env.NODE_ENV !== 'production') await adminJS.initialize();
  else adminJS.watch();
  const adminRouter = adminJSRouter(adminJS);
  app.use(adminJS.options.rootPath, adminRouter);
};

export const attachExpressJS = async (app: Express) => {
  console.info('Iniciando servidor');
  app
    .use(cors({ credentials: true, origin: true }))
    .use(session(sessionOptions))
    .use(compression())
    .use(express.static(path.join(__dirname, '../../../public')))
    .use(express.static('files'))
    // .use('/static', express.static('public'))
    .get('/', (_, res) => res.send('Hello Life'));
};

export const attachGraphQLYoga = async (app: Express) => {
  console.info('GraphqlYoga Iniciado');
  const graphQLServer = createYoga({
    schema,
    cors: false,
    context: createContext,
    graphiql: {
      defaultQuery: /* Query por defecto en el playground */ `
        query {
          me {
            id
            name
          }
        }
      `,
    },
    logging: {
      debug(...args) {
        console.log(args);
        logger.debug([...args]);
      },
      info(...args) {
        logger.info([...args]);
      },
      warn(...args) {
        logger.warn([...args]);
      },
      error(...args) {
        logger.error([...args]);
      },
    },
  });

  app.use(graphQLServer.graphqlEndpoint, graphQLServer);
};
