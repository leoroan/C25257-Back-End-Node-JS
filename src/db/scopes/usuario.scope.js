export default {
  defaultScope: {
    attributes: ['id', 'username', 'nombre', 'apellido', 'email', 'bloqueado', 'ultimoIngreso'],
    include: [
      {
        association: 'rolPrincipal',
        as: 'rolPrincipal',
        attributes: ['id', 'nombre'],
      },
    ],
  },

  loginScope: {
    attributes: ['id', 'username', 'nombre', 'apellido', 'email', 'bloqueado', 'ultimoIngreso', 'password'],
    include: [
      {
        association: 'rolPrincipal',
        as: 'rolPrincipal',
        attributes: ['id', 'nombre'],
      },
    ],
  },

  configScope: {
    attributes: ['id', 'username', 'nombre', 'apellido', 'email', 'bloqueado', 'ultimoIngreso'],
    include: [
      {
        association: 'rolPrincipal',
        as: 'rolPrincipal',
        attributes: ['id', 'nombre'],
      },
      {
        association: 'permisos',
        as: 'permisos',
        attributes: ['accion', 'descripcion'],
        through: { attributes: [] }
      }
    ],
  }
};
