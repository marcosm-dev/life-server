import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';

const PORT = process.env.PORT || 4000;

import { attachExpressJS, attachAdminJS, attachGraphQLYoga } from './app.js';

const app: Express = express();

// import './services/factura-directa.js'
const start = async () => {
  await attachExpressJS(app);
  await attachAdminJS(app);
  await attachGraphQLYoga(app);

  app.listen(PORT, () => {
    console.info(
      `\nYogaGraphQL Express corriendo en:\nhttp://localhost:${PORT}/graphql`
    );
    console.info(`Admin corriendo en:\nhttp://localhost:${PORT}/admin`);
  });
};
await start();
