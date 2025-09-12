import { models } from "../config/db/sequelize.config.js"
import { devLogger } from "../config/logger/logger.config.js";
import { createHash } from "../utils/bcrypt.js";

export const afterSync = async () => {
  await addRoles();
  await addAdmin();
  await addCategorias();
  await addProductos();
  devLogger.info('[DATOS POR DEFECTO PRECARGADOS EN BDD]: ✅ --> Sincronizados.');
}

const addAdmin = async () => {
  const [rolAdmin] = await models.Rol.findOrCreate({ where: { nombre: 'ADMIN' } });
  await models.Usuario.findOrCreate({
    where: { nombre: 'Administrador' },
    defaults: {
      username: process.env.ADMIN_USER,
      password: createHash(process.env.ADMIN_PASS),
      email: process.env.ADMIN_EMAIL,
      nombre: 'Administrador',
      apellido: 'General',
      dni: '00000000',
      rolId: rolAdmin.dataValues.id
    }
  });
  devLogger.info('[USUARIO DEV]:✅ :[' + process.env.ADMIN_USER + ']');
}

const addRoles = async () => {
  const roles = [{ nombre: 'ADMIN' }, { nombre: 'USER' }];
  for (const rol of roles) {
    await models.Rol.findOrCreate({
      where: { nombre: rol.nombre },
      defaults: rol,
    });
  }
  // devLogger.info('[ROLES PRECARGADOS]: ✅ ');
}

const addCategorias = async () => {
  const categorias = [
    { nombre: 'Electrónica', descripcion: 'Dispositivos y gadgets electrónicos.' },
    { nombre: 'Ropa', descripcion: 'Prendas de vestir y accesorios.' },
    { nombre: 'Hogar', descripcion: 'Artículos para el hogar y la cocina.' },
  ];
  for (const categoria of categorias) {
    await models.Categoria.findOrCreate({
      where: { nombre: categoria.nombre },
      defaults: categoria,
    });
  }
  // devLogger.info('[CATEGORÍAS PRECARGADAS]: ✅ ');
}

const addProductos = async () => {
  const categoriaElectronica = await models.Categoria.findOne({ where: { nombre: 'Electrónica' } });
  const categoriaRopa = await models.Categoria.findOne({ where: { nombre: 'Ropa' } });
  const categoriaHogar = await models.Categoria.findOne({ where: { nombre: 'Hogar' } }); 
  const productos = [
    { nombre: 'Smartphone', descripcion: 'Teléfono inteligente de última generación.', precio: 699.99, stock: 50, categoriaId: categoriaElectronica.id },
    { nombre: 'Laptop', descripcion: 'Computadora portátil para trabajo y entretenimiento.', precio: 999.99, stock: 30, categoriaId: categoriaElectronica.id },
    { nombre: 'Camiseta', descripcion: 'Camiseta de algodón cómoda y casual.', precio: 19.99, stock: 100, categoriaId: categoriaRopa.id },
    { nombre: 'Jeans', descripcion: 'Pantalones vaqueros de alta calidad.', precio: 49.99, stock: 60, categoriaId: categoriaRopa.id },
    { nombre: 'Sofá', descripcion: 'Sofá moderno y cómodo para la sala de estar.', precio: 499.99, stock: 20, categoriaId: categoriaHogar.id },
    { nombre: 'Cafetera', descripcion: 'Cafetera automática para preparar café fresco.', precio: 89.99, stock: 40, categoriaId: categoriaHogar.id },
  ];
  for (const producto of productos) {
    await models.Producto.findOrCreate({
      where: { nombre: producto.nombre },
      defaults: producto,
    });
  }
  // devLogger.info('[PRODUCTOS PRECARGADOS]: ✅ ');
}
