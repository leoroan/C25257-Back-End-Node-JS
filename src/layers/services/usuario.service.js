import GenericService from './helper/generic.service.js';
import { models } from '../../config/db/sequelize.config.js';
import { createHash } from '../../utils/bcrypt.js';
import { NotFound } from '../../config/error/errors.js';

export default class UsuarioService extends GenericService {
  constructor(dao) {
    super(dao);
  }

  async create(data) {
    if (data.password) {
      data.password = createHash(data.password);
    }

    if (!data.rolId) {
      const [rolDefault] = await models.Rol.findOrCreate({ where: { nombre: 'ADMINISTRATIVO' }, });
      data.rolId = rolDefault.dataValues.id;
    }

    return await this.dao.create(data);
  }

  async update(id, data) {
    if (data.password) {
      data.password = createHash(data.password);
    }

    if (data.deletedAt) {
      data = { ...data, paranoid: false };
    }

    const oldRecord = await this.dao.findById(id, 'defaultScope', { paranoid: false });

    if (!oldRecord)
      throw new NotFound(`Usuario con ID ${id} no encontrado para actualizar`);

    return await this.dao.update(oldRecord, data);
  }

  async restore(id) {
    return await models.Usuario.restore({
      where: { id },
    });
  }

}
