// import { models } from "../../config/db/sequelize.config.js";

// import UsuarioDAO from "../../layers/daos/usuario.dao.js";
// import UsuarioService from "../services/usuario.service.js";

// // the service
// const usuarioDAO = new UsuarioDAO(models.Usuario);
// export const usuarioService = new UsuarioService(usuarioDAO)

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { models } from '../../config/db/sequelize.config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const daosDir = resolve(__dirname, '../daos');
const servicesDir = resolve(__dirname, '../services');

const serviceInstances = {};

const getBaseName = (filename, suffix) =>
  filename.replace(suffix, '').toLowerCase();

const camelToPascal = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const load = async () => {
  const daoFiles = fs.readdirSync(daosDir).filter(f => f.endsWith('.dao.js'));
  const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.service.js'));

  for (const daoFile of daoFiles) {
    const base = getBaseName(daoFile, '.dao.js'); // "usuario"

    const matchingServiceFile = serviceFiles.find(f => getBaseName(f, '.service.js') === base);
    if (!matchingServiceFile) continue;

    const { default: DAOClass } = await import(`../daos/${daoFile}`);
    const { default: ServiceClass } = await import(`../services/${matchingServiceFile}`);

    const modelName = camelToPascal(base); // "Usuario"
    const model = models[modelName];

    if (!model) {
      console.warn(`⚠️ Modelo ${modelName} no encontrado en Sequelize. Saltando ${base}`);
      continue;
    }

    const dao = new DAOClass(model);
    const service = new ServiceClass(dao);

    serviceInstances[`${base}Service`] = service;
  }
};

await load();

export default serviceInstances;
