import passport from "passport";
import CustomRouter from "./custom/custom.router.js";
import services from "../layers/services/servicesLoader.js";
import UsuarioController from "../layers/controllers/usuario.controller.js";

export default class UsuarioExtendRouter extends CustomRouter {
  /**
   * api:/api/usuarios
   */
  constructor() {
    super();
    this.controller = new UsuarioController(services.usuarioService);
  }

  init() {
    super.init();

    // #swagger.ignore = true

    this.get('/', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.tags = ['Usuarios']
      // #swagger.path = '/usuarios/' 
      // #swagger.summary = 'Obtiene todos los usuarios'
      // #swagger.description = 'Obtiene una lista de todos los usuarios registrados en el sistema.'
      /* 
        #swagger.security = [{
            "bearerAuth": []
        }] 
      */
      this.controller.findAll(req, res, next);
    });

    this.get('/:id', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.tags = ['Usuarios']
      // #swagger.path = '/usuarios/{id}' 
      // #swagger.summary = 'Obtiene un usuario por ID'
      // #swagger.description = 'Obtiene los detalles de un usuario específico por su ID.'
      /* #swagger.parameters['id'] = { 
          in: 'path',
          description: 'ID del usuario a obtener',
          required: true,
          type: 'string'
        } */
      /* 
        #swagger.security = [{
            "bearerAuth": []
        }] 
      */
      this.controller.findById(req, res, next);
    });

    this.post('/nuevo', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      /*
        #swagger.tags = ['Usuarios']
        #swagger.summary = 'Crear un nuevo usuario'
        #swagger.description = 'Crea un nuevo usuario en el sistema.'
        #swagger.path = '/usuarios/nuevo'
        #swagger.method = 'post'
        #swagger.security = [{
            "bearerAuth": []
        }] 

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos del nuevo usuario.',
            required: true,
            schema: {
                nombre: "Juan",
                apellido: "Pérez",
                username: "juanperez",
                password: "contraseñaSegura123",
                email: "juan.perez@example.com",
                dni: "12345678"
            }
        }
    */

      this.controller.create(req, res, next);
    });

    this.delete('/:id', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.tags = ['Usuarios']
      // #swagger.path = '/usuarios/{id}' 
      // #swagger.summary = 'Borrar un usuario por ID'
      // #swagger.description = 'Borrar un usuario específico por su ID.'
      /* #swagger.parameters['id'] = { 
          in: 'path',
          description: 'ID del usuario a borrar',
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

    this.put('/restaurar/:id', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      /*
      #swagger.tags = ['Usuarios']
      #swagger.path = '/usuarios/restaurar/{id}'
      #swagger.summary = 'Restaurar un usuario por ID'
      #swagger.description = 'Restaurar un usuario específico por su ID.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del usuario a restaurar',
        required: true,
        type: 'string'
      }
      #swagger.security = [{
        "bearerAuth": []
      }]
      */

      this.controller.restore(req, res, next);
    });

    this.put('/:id', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.ignore = true
      this.controller.update(req, res, next);
    });

  }
}
