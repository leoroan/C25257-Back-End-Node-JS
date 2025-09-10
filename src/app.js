import config from './config/configuration.js';
import express from 'express';
import configureExpress from './config/server/express.config.js';
import { sequelize } from './config/db/sequelize.config.js';
import { devLogger } from './config/logger/logger.config.js';
import { afterSync } from './db/afterSync.db.js';

const app = express();
configureExpress(app);

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    devLogger.info(`[CONEXION DE LA BDD]: ✅, Conectada en puerto: [${config.db.db_port}]`);

    if (process.env.ENV_MODE === 'DESARROLLO' && process.env.DB_ERASE === "1") {
      await sequelize.drop();
      await sequelize.sync({ force: true });
      devLogger.info(`[ ⛔ BDD REINICIADA ⛔ ]: ✅, Reiniciada y sincronizada.`);
    } else {
      if (process.env.DB_ALTER === "1") {
        await sequelize.sync({ alter: true });
        devLogger.info(`[BDD SINCRONIZADA CON ALTER]: ✅, Se ajustaron esquemas automáticamente.`);
      } else {
        await sequelize.sync();
        devLogger.info(`[BDD SINCRONIZADA]: ✅, Sincronizada sin alterar estructura.`);
      }
    }
    afterSync();

    app.listen(process.env.PORT, () => {
      devLogger.info(`[SERVIDOR]: ✅, Escuchando en el puerto : [${process.env.PORT}]`);
    });
  } catch (error) {
    devLogger.error('Error conectando con la base de datos:', error);
    devLogger.warning('Reintentando en 60 segundos...');
    setTimeout(initializeDatabase, 60000);
  }
}

initializeDatabase();




