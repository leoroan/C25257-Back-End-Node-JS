import jwt from "jsonwebtoken";
import { Router } from "express";
import { PRIVATE_KEY } from "../../utils/jwt.js";
import { Forbidden, Unauthorized } from "../../config/error/errors.js";
import { devLogger } from "../../config/logger/logger.config.js";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.routes = [];
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() { }

  addRoute(method, path, policies, callbacks) {
    this.routes.push({ method, path, policies });
    this.router[method](
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.#applyCallbacks(callbacks)
    );
  }

  get(path, policies, ...callbacks) {
    this.addRoute('get', path, policies, callbacks);
  }

  post(path, policies, ...callbacks) {
    this.addRoute('post', path, policies, callbacks);
  }

  put(path, policies, ...callbacks) {
    this.addRoute('put', path, policies, callbacks);
  }

  delete(path, policies, ...callbacks) {
    this.addRoute('delete', path, policies, callbacks);
  }

  getRoutes() {
    return this.routes;
  }

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === "PUBLIC") return next();
    const token = req.cookies?.jwtCookieToken || req.headers.authorization?.split(' ')[1];
    if (!token) throw new Unauthorized('Usuario sin autenticarse o falta el token.');
    try {
      const decoded = jwt.verify(token, PRIVATE_KEY);  
      if (!(policies.includes(decoded.user.rol.toUpperCase()))) {
        throw new Forbidden(`PROHIBIDO: El usuario no tiene permisos con este rol.`);
      }
      // req.user = decoded.user;   //delego la responsabilidad a passport 
      next();
    } catch (err) {
      throw new Forbidden(err.message);
    }
  };

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = (payload) => {
      res.status(200).json({
        status: 'success',
        payload,
        requester: req.user?.username || 'def'
      });
    };

    next();
  };

  #applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (req, res, next) => {
      try {
        await callback(req, res, next);
      } catch (error) {
        devLogger.debug(error);
        next(error);
      }
    });
  }
}