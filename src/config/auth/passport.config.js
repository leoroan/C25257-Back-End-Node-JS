import passport from 'passport';
import passportLocal from 'passport-local';
import jwtStrategy from 'passport-jwt';
import { models } from "../../config/db/sequelize.config.js";
import { createHash, isValidPassword } from '../../utils/bcrypt.js';
import { PRIVATE_KEY } from '../../utils/jwt.js';
import { devLogger } from '../logger/logger.config.js';
import { Op } from 'sequelize';

const localStrategy = passportLocal.Strategy;
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {

  passport.use('jwt', new JwtStrategy({ jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), secretOrKey: PRIVATE_KEY },
    async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload.user);
      } catch (error) {
        devLogger.error(error);
        return done(error);
      }
    }
  ));

  passport.use('register', new localStrategy({ passReqToCallback: true },
    async (req, username, password, done) => {
      const { nombre, apellido, email } = req.body;
      try {
        const exist = await models.Usuario.findOne({ where: { [Op.or]: [{ email: email }, { username: username }] } });
        if (exist) return done(null, false, { message: 'Nombre de usuario o direccion de correo electronico ya existentes!' });
        const [rolDefault] = await models.Rol.findOrCreate({ where: { nombre: 'ADMINISTRATIVO' } });
        const user = { username, password: createHash(password), nombre, apellido, email, rolId: rolDefault.dataValues.id }
        const result = await models.Usuario.create(user);
        return done(null, result)
      } catch (error) {
        return done(error);
      }
    }
  ))

  passport.use('login', new localStrategy({ passReqToCallback: true, usernameField: 'username' },
    async (req, username, password, done) => {
      try {
        const user = await models.Usuario.scope('loginScope').findOne({ where: { [Op.or]: [{ email: username }, { username: username }] } });
        if (!user) {
          devLogger.debug("No existe un usuario con este nombre de usuario: " + username);
          return done(null, false);
        }
        if (!isValidPassword(user.dataValues, password)) {
          devLogger.debug("Credenciales invalidas para el usuario: " + username);
          return done(null, false);
        }
        await user.update({ cantidadIntentosLoggin: 1, ultimoIngreso: new Date().toISOString() });
        const userDTO = {
          id: user.dataValues.id,
          username: user.dataValues.username,
          nombre: user.dataValues.nombre,
          apellido: user.dataValues.apellido,
          email: user.dataValues.email,
          rol: user.dataValues.rolPrincipal.dataValues.nombre,
          bloqueado: user.dataValues.bloqueado,
          ultimoIngreso: user.dataValues.ultimoIngreso
        };
        return done(null, userDTO);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    if (!user || !user.id) {
      return done(new Error('Error en la serialización del usuario: los datos del usuario no válidos'));
    }
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await models.Usuario.findByPk(id);
      if (!user) {
        return done(new Error('Usuario no encontrado'));
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

const cookieExtractor = (req) => {
  const token = req.cookies?.jwtCookieToken || req.headers?.authorization?.split(' ')[1];
  return token;
};

export default initializePassport;