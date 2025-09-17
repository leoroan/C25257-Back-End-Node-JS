import passport from "passport";
import CustomRouter from "./custom/custom.router.js";
import services from "../layers/services/servicesLoader.js";
import ProductoController from "../layers/controllers/producto.controller.js";

export default class ProductoExtendRouter extends CustomRouter {
  /**
   * api:/api/productos
   */
  constructor() {
    super();
    this.controller = new ProductoController(services.productoService);
  }

  init() {
    super.init();

    this.get('/', ['PUBLIC'], async (req, res, next) => {
      // #swagger.tags = ['Productos']
      // #swagger.path = '/productos/' 
      // #swagger.summary = 'Obtiene todos los productos'
      // #swagger.description = 'Obtiene una lista de todos los productos registrados en el sistema.'
      /* #swagger.parameters['scope'] = { 
           in: 'query',
           description: 'Scope para ver diferentes vistas de los productos',
           required: false,
           type: 'string',
           enum: ['defaultScope', 'detailScope']
         } */
      this.controller.findAll(req, res, next);
    });
    this.get('/:id', ['PUBLIC'], async (req, res, next) => {
      // #swagger.tags = ['Productos']
      // #swagger.path = '/productos/{id}' 
      // #swagger.summary = 'Obtiene un producto por ID'
      // #swagger.description = 'Obtiene los detalles de un producto específico por su ID.'
      /* #swagger.parameters['id'] = { 
          in: 'path',
          description: 'ID del producto a obtener',
          required: true,
          type: 'string'
        } */
      /* #swagger.parameters['scope'] = { 
           in: 'query',
           description: 'Scope para ver diferentes vistas de los productos',
           required: false,
           type: 'string',
           enum: ['defaultScope', 'detailScope']
         } */
      this.controller.findById(req, res, next);
    });

    this.post('/nuevo', ['ADMIN'], passport.authenticate('jwt'), async (req, res, next) => {
      /*
        #swagger.tags = ['Productos']
        #swagger.summary = 'Crear un nuevo producto'
        #swagger.description = 'Crea un nuevo producto en el sistema.'
        #swagger.path = '/productos/nuevo'
        #swagger.method = 'post'
        #swagger.security = [{
            "bearerAuth": []
        }] 

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos del nuevo producto.',
            required: true,
            schema: {
                nombre: "Producto ejemplo",
                descripcion: "Descripción del producto",
                precio: 100.0,
                stock: 10
            }
        }
    */

      this.controller.create(req, res, next);
    });

    this.delete('/:id', ['ADMIN'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.tags = ['Productos']
      // #swagger.path = '/productos/{id}' 
      // #swagger.summary = 'Borrar un producto por ID'
      // #swagger.description = 'Borrar un producto específico por su ID.'
      /* #swagger.parameters['id'] = { 
          in: 'path',
          description: 'ID del producto a borrar',
          required: true,
          type: 'string'
        } */
      /* 
        #swagger.security = [{
            "bearerAuth": []
        }] 
      */
      this.controller.delete(req, res, next);
    });

    this.put('/restaurar/:id', ['ADMIN'], passport.authenticate('jwt'), async (req, res, next) => {
      /*
      #swagger.tags = ['Productos']
      #swagger.path = '/productos/restaurar/{id}'
      #swagger.summary = 'Restaurar un producto por ID'
      #swagger.description = 'Restaurar un producto específico por su ID.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del producto a restaurar',
        required: true,
        type: 'string'
      }
      #swagger.security = [{
        "bearerAuth": []
      }]
      */

      this.controller.restore(req, res, next);
    });

    this.put('/:id', ['ADMIN'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.ignore = true
      this.controller.update(req, res, next);
    });
  }
}