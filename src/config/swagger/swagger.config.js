import swaggerAutogen from 'swagger-autogen';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, '../../routes');

const routeFiles = fs.readdirSync(routesDir)
  .filter(file =>
    // Filtrar solo archivos .js y excluir posibles archivos no deseados
    file.endsWith('.js') &&
    !file.endsWith('.test.js') &&
    !file.endsWith('.spec.js')
  )
  .map(file => {
    // Crear ruta relativa desde la ubicación del archivo de configuración
    const absolutePath = path.join(routesDir, file);
    return path.relative(__dirname, absolutePath).replace(/\\/g, '/');
  });

// Ahora routes contiene todos los archivos .js del directorio routes
const routes = routeFiles;

const options = {
  openapi: null,     // Enable/Disable OpenAPI.                        By default is null
  language: 'en-US',     // Change response language.                      By default is 'en-US'
  disableLogs: false,    // Enable/Disable logs.                           By default is false
  autoHeaders: true,    // Enable/Disable automatic headers recognition.  By default is true
  autoQuery: true,    // Enable/Disable automatic query recognition.    By default is true
  autoBody: true,    // Enable/Disable automatic body recognition.     By default is true
  writeOutputFile: true     // Enable/Disable writing the output file. By default is true
};

/*
autoHeaders, autoQuery and autoBody: Enable or disable automatic automatic body, 
query or headers recognition. To enable/disable the recognition for a specific endpoint, 
use the following tags in the endpoint's function:

                // #swagger.autoBody = true 
                OR 
                // #swagger.autoBody = false

                // #swagger.autoQuery = true 
                OR 
                // #swagger.autoQuery = false

                // #swagger.autoHeaders = true 
                OR 
                // #swagger.autoHeaders = false
*/

const doc = {
  info: {
    version: '1.0.0',            // by default: '1.0.0'
    title: 'c25257-back-end-node-js', // by default: 'REST API'
    description: 'Documentacion de apis para c25257-back-end-node-js.'         // by default: ''
  },
  host: process.env.ENV_MODE === 'PRODUCCION' ? 'api.c25257-back-end-node-js.com' : 'localhost:8081',                 // by default: 'localhost:3000'
  basePath: '/api',             // by default: '/'
  schemes: [process.env.ENV_MODE === 'PRODUCCION' ? 'https' : 'http'],              // by default: ['http']
  consumes: ['application/json'],             // by default: ['application/json']
  produces: ['application/json'],             // by default: ['application/json']
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Pega tu JWT aquí con el formato: Bearer <token>'
    },
  },
  definitions: {}           // by default: empty object
};

const outputFile = './swagger-output.json';
// const routes = ['../../routes/session.router.js', '../../routes/usuario.router.js', '../../routes/log.router.js'];

swaggerAutogen(options)(outputFile, routes, doc).then(async () => {
  await import('../../app.js');
});