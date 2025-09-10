import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { addLogger } from '../../middlewares/logger.middleware.js'
import errorHandler from '../../middlewares/errorHandler.middleware.js'
import initializePassport from '../auth/passport.config.js'
import { NotFound } from '../error/errors.js'
import swaggerUi from 'swagger-ui-express'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesDir = path.resolve(__dirname, '../../routes');

const swaggerPath = path.resolve(__dirname, '../swagger/swagger-output.json');
let swaggerFile = null;
if (fs.existsSync(swaggerPath)) {
  swaggerFile = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
}

export default async function configureExpress(app) {
  initializePassport();
  app.use(passport.initialize());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

  const allowedOrigins = [process.env.FRONTEND_ORIGIN];

  app.use(cors({
    origin: process.env.ENV_MODE === 'DESARROLLO'
      ? [`http://localhost:${process.env.PORT}`, `http://127.0.0.1:${process.env.PORT}`, `http://localhost:*`]
      : function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('NO PERMITIDO POR CORS'));
        }
      },
    credentials: true
  }));

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  // app.use(cookieParser('@ny1kN0wTh15?'))
  app.use(cookieParser())
  app.use(helmet());
  app.use(addLogger)

  app.use(session({
    secret: 'InvtMT@202X',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.ENV_MODE === 'PRODUCCION' ? true : false,
      // sameSite: "strict",
      maxAge: Number(process.env.SESSION_COOKIE_VTO)
    }
  }));
  app.use(passport.session());

  const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.router.js'));

  for (const file of routeFiles) {
    const { default: RouteClass } = await import(`../../routes/${file}`);
    const instance = new RouteClass();

    const baseName = file.replace('.router.js', '').toLowerCase();
    const basePath = baseName === 'session' ? '/api/session' : `/api/${baseName}s`;

    app.use(basePath, instance.getRouter());
  }

  app.use((req, res, next) => {
    next(new NotFound('Page not found'));
  });

  app.use(errorHandler);

  app.get('/status', (req, res) => {
    res.sendStatus(200);
  });


}