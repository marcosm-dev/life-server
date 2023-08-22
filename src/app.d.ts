import express from 'express';

declare module 'app.js' {
  export function attachExpressJS(app: express.Express): Promise<void>;

  export function attachGraphQLYoga(app: express.Express): Promise<void>;

  export function attachAdminJS(app: express.Express): Promise<void>;
}

declare module 'graphql/logger.js' {
  // Define los tipos necesarios para el módulo logger.js si es que los estás usando en TypeScript
}

declare module 'graphql/context.js' {
  // Define los tipos necesarios para el módulo context.js si es que los estás usando en TypeScript
}

declare module 'graphql/schema.js' {
  // Define los tipos necesarios para el módulo schema.js si es que los estás usando en TypeScript
}
