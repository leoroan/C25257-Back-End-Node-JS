import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Categoria extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    }, {
      sequelize,
      modelName: 'Categoria',
      tableName: 'Categorias',
      timestamps: true,
      paranoid: true,
    });
  }
}