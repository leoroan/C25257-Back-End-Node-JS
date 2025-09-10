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

    this.get('/', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      this.controller.findAll(req, res, next);
    });

    this.get('/:id', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      this.controller.findById(req, res, next);
    });

    this.post('/', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      this.controller.create(req, res, next);
    });

    this.post('/restaurar/:id', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      this.controller.restore(req, res, next);
    });

    this.put('/:id', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      this.controller.update(req, res, next);
    });

    this.delete('/:id', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      this.controller.delete(req, res, next);
    });
  }
}
