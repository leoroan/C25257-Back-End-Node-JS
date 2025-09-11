import passport from 'passport';
import { generateJWToken } from "../utils/jwt.js";
import CustomRouter from "./custom/custom.router.js";
import { devLogger } from '../config/logger/logger.config.js';
import { Conflict, InternalServerError, Unauthorized } from '../config/error/errors.js';


export default class sessionExtendRouter extends CustomRouter {
  constructor() {
    super();
  }

  init() {
    super.init();

    this.post('/register', ["USER", "ADMIN"], passport.authenticate('jwt'), (req, res, next) => {
      // #swagger.ignore = true
      passport.authenticate('register', (err, user, info) => {
        if (err) {
          devLogger.debug("Error en Passport Authenticate:", err);
          return next(new Unauthorized('Error en la creación de nuevo usuario registrado', { details: err.message }));
        }
        if (!user) {
          return next(new Conflict(info.message));
        }
        return res.sendSuccess({ message: 'Usuario registrado correctamente' });
      })(req, res, next);
    });

    // LOGIN
    this.post('/login', ['PUBLIC'], async (req, res, next) => {
      /* 
        #swagger.tags = ['Sessions']
        #swagger.path = '/session/login'
        #swagger.summary = 'Login de usuario'
        #swagger.description = 'Permite iniciar sesión y obtener un JWT'
        #swagger.parameters['body'] = {
          in: 'body',
          description: 'Credenciales de usuario',
          required: true,
          schema: {
            $username: 'usuario@ejemplo.com',
            $password: 'contraseña123'
          }
        }
        #swagger.responses[200] = {
          description: 'Login exitoso',
          schema: {
            token: 'jwt_token'
          }
        }
        #swagger.responses[401] = {
          description: 'Usuario o contraseña incorrectos'
        }
      */
      passport.authenticate('login', async (err, user, info) => {
        if (err) {
          devLogger.debug("Error en Passport Authenticate:", err);
          return next(new InternalServerError('Error en autenticación', { details: err.message }));
        }
        if (!user) {
          return next(new Unauthorized('Usuario o contraseña incorrectos.'));
        }

        req.logIn(user, async (err) => {
          if (err) {
            devLogger.debug("Error al intentar iniciar sesión:", err);
            return next(new InternalServerError('Error al iniciar sesión', { details: err.message }));
          }
          try {
            const { id, username, nombre, apellido, email, rol } = user;
            const access_token = generateJWToken({ id, username, nombre, apellido, email, rol });
            res.cookie('jwtCookieToken', access_token, { httpOnly: true });
            return res.sendSuccess({ token: access_token });
          } catch (error) {
            devLogger.debug('Error al intentar loggearse:', error);
            return next(new InternalServerError('Error al generar token de sesión', { details: error.message }));
          }
        });
      })(req, res, next);
    });

    // LOGOUT
    this.post('/logout', ['PUBLIC'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.ignore = true
      try {
        if (!req.user) {
          return next(new Unauthorized('No hay ningún usuario autenticado conectado.'));
        }
        res.clearCookie('jwtCookieToken');
        await new Promise((resolve, reject) => {
          req.session.destroy((err) => {
            if (err) { return reject(new InternalServerError('Error al cerrar sesión', { details: err.message })); }
            resolve();
          });
        });

        return res.sendSuccess({ message: 'Desconectado correctamente' });
      } catch (error) {
        devLogger.debug('Error al cerrar sesión:', error);
        return next(error);
      }
    });
  }
}
