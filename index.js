import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config({ quiet: true });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('+----------------------------------------------------+');
  console.log(`| 🚀 Servidor en ejecución:                          |`);
  console.log(`| Entorno: ${process.env.ENV_MODE.padEnd(41)} |`);
  console.log(`| Puerto: ${String(PORT).padEnd(43)}|`);
  console.log(`| URL Local: http://localhost:${PORT.toString().padEnd(22)} |`);
  console.log('+----------------------------------------------------+');
});
