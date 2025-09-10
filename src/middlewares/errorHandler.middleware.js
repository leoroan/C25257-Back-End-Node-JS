import { devLogger } from "../config/logger/logger.config.js";
import CustomError from '../config/error/customError.js';
import { SequelizeError } from '../config/error/errors.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  const cleanMessage = (message) => {
    return typeof message === 'string' ? message.replace(/\u001b\[\d+m/g, '') : message;
  };

  if (error.name?.startsWith('Sequelize')) {
    error = SequelizeError.handleSequelizeError(error);
  }

  if (!(error instanceof CustomError)) {
    error = new CustomError(500, 'Error interno del servidor', {
      originalError: error,
      expose: false
    });
  }

  res.status(error.statusCode).json({
    status: 'Error',
    statusCode: error.statusCode,
    code: error.code,
    message: error.expose ? cleanMessage(error.message) : 'Error interno del servidor',
    details: error.details || undefined,
  });

  const logLevel = error.statusCode >= 500 ? 'error' : 'debug';
  devLogger[logLevel]({
    type: 'Error',
    code: error.code,
    statusCode: error.statusCode,
    message: cleanMessage(error.message),
    details: error.details,
    stack: error.stack
  });
};

export default errorHandler;
