import cors from 'cors';
import express from 'express';
import setupSecurityMiddleware from './middleware/security.midd.js';
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes.js';

dotenv.config();
const app = express();

// Configuracion
setupSecurityMiddleware(app);
app.use(cors({
  origin: process.env.ENV_MODE === 'development'
    ? '*'
    : function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('NO PERMITIDO POR CORS'));
      }
    },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
  secret: 'Lean-dro@202X',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.ENV_MODE === 'production' ? true : false,
    maxAge: Number(process.env.SESSION_COOKIE_VTO)
  }
}));
// --- Definición de Rutas ---

// versión de la API
const API_VERSION = '/api/v1';
app.use(`${API_VERSION}/productos`, productRoutes);
console.log(`✅ Rutas de Productos montadas en ${API_VERSION}/productos`);

// Ruta de Salud (Health Check)
app.get(`${API_VERSION}/status`, (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API está funcionando correctamente.',
    environment: process.env.NODE_ENV,
  });
});

// --- Manejo de Rutas No Encontradas (404) ---
app.use((req, res, next) => {
  res.status(404).json({
    message: `Recurso no encontrado: ${req.method} ${req.originalUrl}`
  });
});

// --- Levantar servidor ---
app.listen(process.env.PORT, () => {
  console.log('+----------------------------------------------------+');
  console.log(`| 🚀 Servidor en ejecución:                          |`);
  console.log(`| Entorno: ${process.env.ENV_MODE.padEnd(41)} |`);
  console.log(`| Puerto: ${String(process.env.PORT).padEnd(43)}|`);
  console.log(`| URL Local: http://localhost:${process.env.PORT.padEnd(22)} |`);
  console.log('+----------------------------------------------------+');
});

export default app;