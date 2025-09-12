import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;

import _Usuario from "./usuario.model.js";
import _Rol from "./rol.model.js";
import _Producto from "./producto.model.js";
import _Categoria from "./categoria.model.js";

export default function initModels(sequelize) {
  const Usuario = _Usuario.init(sequelize, DataTypes);
  const Rol = _Rol.init(sequelize, DataTypes);
  const Producto = _Producto.init(sequelize, DataTypes);
  const Categoria = _Categoria.init(sequelize, DataTypes);

  // Usuario -> Rol
  Usuario.belongsTo(Rol, { as: 'rolPrincipal', foreignKey: { name: 'rolId', allowNull: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' } });
  Rol.hasMany(Usuario, { as: 'usuarios', foreignKey: { name: 'rolId', allowNull: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' } });

  // Producto -> Categoria
  Producto.belongsTo(Categoria, { as: 'categoria', foreignKey: { name: 'categoriaId', allowNull: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' } });
  Categoria.hasMany(Producto, { as: 'productos', foreignKey: { name: 'categoriaId', allowNull: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' } });

  return {
    Usuario,
    Rol,
    Producto,
    Categoria,
  };
}
