'use strict';
import { resolve } from 'path';
import fs, { readFileSync } from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';

import { fileURLToPath } from 'url';
import { dirname, basename } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || 'development';

const filePath = resolve(__dirname, '../config/config.json');
const config = JSON.parse(readFileSync(filePath, 'utf8'));
const configEnv = config[env];


const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], configEnv);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, configEnv);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(async (file) => {
    const model = (await import(path.join(__dirname, file)));

    console.log(path.join(__dirname, file))

    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
