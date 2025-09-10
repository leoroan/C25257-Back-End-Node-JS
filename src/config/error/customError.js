class CustomError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = options.code || 'UNDEFINED_ERROR';
    this.details = options.details || null;
    this.expose = options.expose ?? statusCode < 500;
    this.stack = options.originalError?.stack || new Error().stack; 
  }

  static create(statusCode, message, options = {}) {
    return new CustomError(statusCode, message, options);
  }
}

export default CustomError;
