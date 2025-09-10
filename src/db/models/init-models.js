import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;

import _Usuario from "./usuario.model.js";
import _Rol from "./rol.model.js";

export default function initModels(sequelize) {
  const Usuario = _Usuario.init(sequelize, DataTypes);
  const Rol = _Rol.init(sequelize, DataTypes);

  // Usuario -> Rol
  Usuario.belongsTo(Rol, { as: 'rolPrincipal', foreignKey: { name: 'rolId', allowNull: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' } });
  Rol.hasMany(Usuario, { as: 'usuarios', foreignKey: { name: 'rolId', allowNull: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' } });


  return {
    Usuario,
    Rol,
  };
}
