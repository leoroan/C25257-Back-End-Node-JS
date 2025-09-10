import { BadRequest, NotFound } from "../../config/error/errors.js";

export default class LogsController {
  constructor(service) {
    this.service = service;
  }

  async getLogs(req, res, next) {
    try {
      const logs = await this.service.listLogs("prod");
      if (!logs) {
        throw new NotFound('No se encontraron logs');
      }
      return res.sendSuccess(logs);
    } catch (error) {
      next(error);
    }
  }

  async getAlog(req, res, next) {
    try {
      const { filename } = req.params;
      const log = await this.service.getLog("prod", filename);
      if (!log) {
        throw new NotFound('No se encontro el log o está vacío');
      }
      return res.sendSuccess(log);
    } catch (error) {
      next(error);
    }
  }

  async downloadLog(req, res, next) {
    try {
      const { filename } = req.params;
      await this.service.downloadLog(res, "prod", filename);
    } catch (error) {
      next(error);
    }
  }


}