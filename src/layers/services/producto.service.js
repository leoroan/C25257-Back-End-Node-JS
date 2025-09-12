import GenericService from './helper/generic.service.js';
import { models } from '../../config/db/sequelize.config.js';
import { createHash } from '../../utils/bcrypt.js';
import { NotFound } from '../../config/error/errors.js';

export default class UsuarioService extends GenericService {
  constructor(dao) {
    super(dao);
  }
}
