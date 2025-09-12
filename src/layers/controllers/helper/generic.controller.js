export default class GenericController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res, next) {
    try {
      const newRecord = await this.service.create(req.body);
      return res.sendSuccess(`Nuevo registro creado con el ID:${newRecord.id}`);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { scope, opt } = req.query
      const record = await this.service.findById(req.params.id, scope, opt);
      return res.sendSuccess(record);
    } catch (error) {
      next(error);
    }
  }

  async findByField(req, res, next) {
    try {
      const record = await this.service.findByField(req.params);
      return res.sendSuccess(record);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      // const { page, limit, scope, filters } = req.query
      const records = await this.service.findAll(req.query);
      return res.sendSuccess(records);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      await this.service.update(req.params.id, req.body);
      return res.sendSuccess('success');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.service.delete(req.params.id);
      return res.sendSuccess('success');
    } catch (error) {
      next(error);
    }
  }

  async countRegisters(req, res, next) {
    try {
      const total = await this.service.countRegisters();
      return res.sendSuccess(total)
    } catch (error) {
      next(error);
    }
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