export default {
  defaultScope: {
    attributes: ['id', 'nombre', 'precio', 'stock'],
    include: [
      {
        association: 'categoria',
        as: 'categoria',
        attributes: ['id', 'nombre'],
      },
    ],
  },

  detailScope: {
    attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock', 'createdAt', 'updatedAt'],
    include: [
      {
        association: 'categoria',
        as: 'categoria',
        attributes: ['id', 'nombre', 'descripcion'],
      },
    ],
  },
};