import { Sequelize } from "sequelize";
import config from '../configuration.js';
import initModels from "../../db/models/init-models.js";
import initScopes from "../../db/scopes/init-scopes.js";

const database = config.db.database;
const username = config.db.user;
const password = config.db.password;
const host = config.db.host;
const port = config.db.db_port;
const dialect = config.db.db_dialect;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port || 5432,
  dialect: dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  timezone: '-03:00',
  define: {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    paranoid: true
  },
  logging: process.env.NODE_ENV === 'DESARROLLO' ? console.log : false,
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const models = initModels(sequelize);
initScopes(models);

export { sequelize, models };