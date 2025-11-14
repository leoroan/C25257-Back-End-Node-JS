import cors from 'cors';
import express from 'express';
import setupSecurityMiddleware from './middleware/security.midd.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

// if (process.env.ENV_MODE === 'production') {
//   setupSecurityMiddleware(app);
// }

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
    httpOnly: process.env.ENV_MODE === 'production',
    secure: process.env.ENV_MODE === 'production',
    maxAge: Number(process.env.SESSION_COOKIE_VTO)
  }
}));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -- Rutas de vistas
app.get("/", (req, res) => res.redirect("/home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/home", (req, res) => res.render("home"));
app.get("/profile", (req, res) => res.render("profile"));
app.get("/cart", (req, res) => res.render("cart"));

// --- Rutas ---
const API_VERSION = '/api/v1';
app.use(`${API_VERSION}/products`, productRoutes);
app.use(`${API_VERSION}/auth`, authRoutes);

app.get(`${API_VERSION}/status`, (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API está funcionando correctamente.',
    environment: process.env.NODE_ENV,
  });
});

// --- Manejo de 404 ---
app.use((req, res) => {
  res.status(404).json({
    message: `Recurso no encontrado: ${req.method} ${req.originalUrl}`
  });
});

// --- Manejo de errores ---
app.use((err, req, res, next) => {
  console.error('💥 Error inesperado:', err.message);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor'
  });
});

export default app;
