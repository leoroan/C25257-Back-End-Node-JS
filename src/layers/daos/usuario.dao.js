import GenericDAO from "./helper/generic.dao.js";

export default class UsuarioDAO extends GenericDAO {
  constructor(aModel) {
    super(aModel);
  }

  async findById(id, scope) {
    scope = Array.isArray(scope) ? scope : scope.split(',');
    return await this.model.scope(scope).findByPk(id, { paranoid: false })
  }
}