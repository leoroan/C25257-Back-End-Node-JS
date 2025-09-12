import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Rol extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      nombre: {
        type: DataTypes.STRING(25),
      },
    }, {
      sequelize,
      modelName: 'Rol',
      tableName: 'Roles',
      timestamps: true,
      paranoid: true,
    });
  }
}
