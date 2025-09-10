import passport from "passport";
import CustomRouter from "./custom/custom.router.js";
import logsController from "../layers/controllers/logs.controller.js";
import logsService from "../layers/services/logs.service.js";

export default class LogsExtendRouter extends CustomRouter {
  /**
   * api:/api/logs
   */
  constructor() {
    super();
    this.logsController = new logsController(new logsService());
  }

  init() {
    super.init();

    this.get('/prod-list', ['ADMIN'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.tags = ['Logs']
      // #swagger.path = '/logs/prod-list'
      // #swagger.summary = 'Obtiene una lista de logs de producción'
      // #swagger.description = 'Obtiene una lista de logs de producción.'
      /* 
        #swagger.security = [{
            "bearerAuth": []
        }] 
      */
      this.logsController.getLogs(req, res, next);
    });

    this.get('/prod/file/:filename', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.tags = ['Logs']
      // #swagger.path = '/logs/prod/file/{filename}'
      // #swagger.summary = 'Obtiene un log de producción'
      // #swagger.description = 'Obtiene un log de producción específico por su nombre de archivo.'
      /* 
        #swagger.security = [{
            "bearerAuth": []
        }] 
      */
      this.logsController.getAlog(req, res, next);
    });

    this.get('/prod/download/:filename', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      // #swagger.tags = ['Logs']
      // #swagger.path = '/logs/prod/download/{filename}'
      // #swagger.summary = 'Descarga un log de producción'
      // #swagger.description = 'Descarga un log de producción específico por su nombre de archivo.'
      /* 
        #swagger.security = [{
            "bearerAuth": []
        }] 
      */
      this.logsController.downloadLog(req, res, next);
    });

  }
}

