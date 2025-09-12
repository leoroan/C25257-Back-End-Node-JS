import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Producto extends Model {
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
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      imagenUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    }, {
      sequelize,
      modelName: 'Producto',
      tableName: 'Productos',
      timestamps: true,
      paranoid: true,
    });
  }
}
