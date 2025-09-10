import { Op } from 'sequelize';
import { BadRequest, NotFound } from '../../../config/error/errors.js';

export default class GenericService {
  constructor(dao) {
    this.dao = dao;
  }

  async create(data) {
    return await this.dao.create(data);
  }

  async findById(id, scope = 'defaultScope') {
    if (!id) {
      throw new BadRequest('El ID es obligatorio');
    }
    const record = await this.dao.findById(id, scope);
    if (!record) {
      throw new NotFound(`${this.dao.model.name} con ID ${id} no encontrado`);
    }
    return record;
  }

  async findByField(data, scope = 'defaultScope') {
    if (!data) {
      throw new BadRequest('Un campo es obligatorios');
    }
    const record = await this.dao.findOne({ where: data }, scope);
    if (!record) {
      throw new NotFound(`${this.dao.model.name} con ${JSON.stringify(data)} no encontrado`);
    }
    return record;
  }

  
  async findAll(params) {
    const { page = 1, limit = 10, scope = 'defaultScope', ...filters } = params;
    const offset = (page - 1) * limit;
    const where = {};

    for (const [key, value] of Object.entries(filters)) {
      if (key.endsWith('__eq')) {
        const field = key.replace('__eq', '');
        where[field] = { [Op.eq]: value };
      } else if (key.endsWith('__like')) {
        const field = key.replace('__like', '');
        where[field] = { [Op.like]: ` %${value}%` };
      } else if (key.endsWith('__null')) {
        const field = key.replace('__null', '');
        where[field] = value === 'true' ? { [Op.is]: null } : { [Op.not]: null };
      } else {
        where[key] = { [Op.like]: `%${value}%` };
      }
    }
    return await this.dao.findAll({ offset, limit, where }, scope);
  };

  async update(id, data) {
    const oldRecord = await this.findById(id);
    const updated = await this.dao.update(oldRecord, data);
    if (!updated) {
      throw SequelizeError.handleSequelizeError(error, `Error actualizando ${this.model.name}`);
    }
    return updated;
  }

  async delete(id) {
    const deleted = await this.dao.delete(id);
    if (!deleted) {
      throw new NotFound(`${this.dao.model.name} con ID ${id} no encontrado para eliminar`);
    }
    return deleted;

  }

  async countRegisters() {
    return await this.dao.countRegisters();
  }

}