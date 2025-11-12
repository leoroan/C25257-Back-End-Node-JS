import cors from 'cors';
import express from 'express';
import setupSecurityMiddleware from './middleware/security.midd.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes.js';

dotenv.config({ quiet: true });

const app = express();

// Configuración de seguridad general
setupSecurityMiddleware(app);

// Configuración CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
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

// Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'Lean-dro@202X',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.ENV_MODE === 'production',
    maxAge: Number(process.env.SESSION_COOKIE_VTO)
  }
}));

// --- Rutas ---
const API_VERSION = '/api/v1';

app.use(`${API_VERSION}/productos`, productRoutes);

app.get(`${API_VERSION}/status`, (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API está funcionando correctamente.',
    environment: process.env.NODE_ENV,
  });
});

// --- ruta por defecto ---
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido. Visite /api/v1/status para verificar el estado.'
  });
});


// --- Manejo de 404 ---
app.use((req, res) => {
  res.status(404).json({
    message: `Recurso no encontrado: ${req.method} ${req.originalUrl}`
  });
});

export default app;
