import GenericController from "./helper/generic.controller.js";
export default class UsuarioController extends GenericController {
  constructor(service) {
    super(service);
  }

  async restore(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.service.restore(id);
      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  }
}