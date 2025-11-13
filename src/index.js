import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const { default: app } = await import('./app.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('+----------------------------------------------------+');
  console.log(`| 🚀 Servidor en ejecución:                          |`);
  console.log(`| Entorno: ${process.env.ENV_MODE.padEnd(41)} |`);
  console.log(`| Puerto: ${String(PORT).padEnd(43)}|`);
  console.log(`| URL Local: http://localhost:${PORT.toString().padEnd(22)} |`);
  console.log('+----------------------------------------------------+');
});

