import { models } from "../config/db/sequelize.config.js"
import { devLogger } from "../config/logger/logger.config.js";
import { createHash } from "../utils/bcrypt.js";

export const afterSync = async () => {
  await addRoles();
  await addAdmin();
  devLogger.info('[DATOS POR DEFECTO PRECARGADOS EN BDD]: ✅ --> Sincronizados.');
}

const addAdmin = async () => {
  const [rolAdmin] = await models.Rol.findOrCreate({ where: { nombre: 'ADMIN' } });
  await models.Usuario.findOrCreate({
    where: { nombre: 'Administrador' },
    defaults: {
      username: process.env.ADMIN_USER,
      password: createHash(process.env.ADMIN_PASS),
      email: process.env.ADMIN_EMAIL,
      nombre: 'Administrador',
      apellido: 'General',
      dni: '00000000',
      rolId: rolAdmin.dataValues.id
    }
  });
  devLogger.info('[USUARIO DEV]:✅ :[' + process.env.ADMIN_USER + ']');
}

const addRoles = async () => {
  const roles = [{ nombre: 'ADMIN' }, { nombre: 'USER' }];
  for (const rol of roles) {
    await models.Rol.findOrCreate({
      where: { nombre: rol.nombre },
      defaults: rol,
    });
  }
  // devLogger.info('[ROLES PRECARGADOS]: ✅ ');
}


