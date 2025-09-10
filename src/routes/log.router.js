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

    this.get('/prod', ['ADMIN'], passport.authenticate('jwt'), async (req, res, next) => { // dev & prod
      this.logsController.getLogs(req, res, next);
    });

    this.get('/prod/:filename', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      this.logsController.getAlog(req, res, next);
    });

    this.get('/download/prod/:filename', ['ADMIN', 'USER'], passport.authenticate('jwt'), async (req, res, next) => {
      this.logsController.downloadLog(req, res, next);
    });

  }
}

