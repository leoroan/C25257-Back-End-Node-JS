import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Usuario extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      dni: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true
      },
      cantidadIntentosLoggin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      bloqueado: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      bloqueoExpiration: {
        type: DataTypes.DATE,
        allowNull: true
      },
      ultimoIngreso: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
      {
        sequelize,
        timestamps: true, // Habilita timestamps (createdAt, updatedAt)
        paranoid: true, // Habilita eliminación suave (soft delete)
      }
    );
  }
}