import CustomError from './customError.js';

export class BadRequest extends CustomError {
  constructor(message = 'Bad Request', options = {}) {
    super(400, message, { ...options, expose: true, code: 'BAD_REQUEST' });
  }
}

export class Unauthorized extends CustomError {
  constructor(message = 'Unauthorized', options = {}) {
    super(401, message, { ...options, expose: true, code: 'UNAUTHORIZED' });
  }
}

export class PaymentRequired extends CustomError {
  constructor(message = 'Payment Required', options = {}) {
    super(402, message, { ...options, expose: true, code: 'PAYMENT_REQUIRED' });
  }
}

export class Forbidden extends CustomError {
  constructor(message = 'Forbidden', options = {}) {
    super(403, message, { ...options, expose: true, code: 'FORBIDDEN' });
  }
}

export class NotFound extends CustomError {
  constructor(message = 'Not Found', options = {}) {
    super(404, message, { ...options, expose: true, code: 'NOT_FOUND' });
  }
}

export class MethodNotAllowed extends CustomError {
  constructor(message = 'Method Not Allowed', options = {}) {
    super(405, message, { ...options, expose: true, code: 'METHOD_NOT_ALLOWED' });
  }
}

export class NotAcceptable extends CustomError {
  constructor(message = 'Not Acceptable', options = {}) {
    super(406, message, { ...options, expose: true, code: 'NOT_ACCEPTABLE' });
  }
}

export class ProxyAuthenticationRequired extends CustomError {
  constructor(message = 'Proxy Authentication Required', options = {}) {
    super(407, message, { ...options, expose: true, code: 'PROXY_AUTH_REQUIRED' });
  }
}

export class RequestTimeout extends CustomError {
  constructor(message = 'Request Timeout', options = {}) {
    super(408, message, { ...options, expose: true, code: 'REQUEST_TIMEOUT' });
  }
}

export class Conflict extends CustomError {
  constructor(message = 'Conflict', options = {}) {
    super(409, message, { ...options, expose: true, code: 'CONFLICT' });
  }
}

export class Gone extends CustomError {
  constructor(message = 'Gone', options = {}) {
    super(410, message, { ...options, expose: true, code: 'GONE' });
  }
}

export class LengthRequired extends CustomError {
  constructor(message = 'Length Required', options = {}) {
    super(411, message, { ...options, expose: true, code: 'LENGTH_REQUIRED' });
  }
}

export class PreconditionFailed extends CustomError {
  constructor(message = 'Precondition Failed', options = {}) {
    super(412, message, { ...options, expose: true, code: 'PRECONDITION_FAILED' });
  }
}

export class PayloadTooLarge extends CustomError {
  constructor(message = 'Payload Too Large', options = {}) {
    super(413, message, { ...options, expose: true, code: 'PAYLOAD_TOO_LARGE' });
  }
}

export class URITooLong extends CustomError {
  constructor(message = 'URI Too Long', options = {}) {
    super(414, message, { ...options, expose: true, code: 'URI_TOO_LONG' });
  }
}

export class UnsupportedMediaType extends CustomError {
  constructor(message = 'Unsupported Media Type', options = {}) {
    super(415, message, { ...options, expose: true, code: 'UNSUPPORTED_MEDIA_TYPE' });
  }
}

export class RangeNotSatisfiable extends CustomError {
  constructor(message = 'Range Not Satisfiable', options = {}) {
    super(416, message, { ...options, expose: true, code: 'RANGE_NOT_SATISFIABLE' });
  }
}

export class ExpectationFailed extends CustomError {
  constructor(message = 'Expectation Failed', options = {}) {
    super(417, message, { ...options, expose: true, code: 'EXPECTATION_FAILED' });
  }
}

export class ImATeapot extends CustomError {
  constructor(message = "I'm a Teapot", options = {}) {
    super(418, message, { ...options, expose: true, code: 'IM_A_TEAPOT' });
  }
}

export class MisdirectedRequest extends CustomError {
  constructor(message = 'Misdirected Request', options = {}) {
    super(421, message, { ...options, expose: true, code: 'MISDIRECTED_REQUEST' });
  }
}

export class UnprocessableEntity extends CustomError {
  constructor(message = 'Unprocessable Entity', options = {}) {
    super(422, message, { ...options, expose: true, code: 'UNPROCESSABLE_ENTITY' });
  }
}

export class Locked extends CustomError {
  constructor(message = 'Locked', options = {}) {
    super(423, message, { ...options, expose: true, code: 'LOCKED' });
  }
}

export class FailedDependency extends CustomError {
  constructor(message = 'Failed Dependency', options = {}) {
    super(424, message, { ...options, expose: true, code: 'FAILED_DEPENDENCY' });
  }
}

export class TooEarly extends CustomError {
  constructor(message = 'Too Early', options = {}) {
    super(425, message, { ...options, expose: true, code: 'TOO_EARLY' });
  }
}

export class UpgradeRequired extends CustomError {
  constructor(message = 'Upgrade Required', options = {}) {
    super(426, message, { ...options, expose: true, code: 'UPGRADE_REQUIRED' });
  }
}

export class PreconditionRequired extends CustomError {
  constructor(message = 'Precondition Required', options = {}) {
    super(428, message, { ...options, expose: true, code: 'PRECONDITION_REQUIRED' });
  }
}

export class TooManyRequests extends CustomError {
  constructor(message = 'Too Many Requests', options = {}) {
    super(429, message, { ...options, expose: true, code: 'TOO_MANY_REQUESTS' });
  }
}

export class RequestHeaderFieldsTooLarge extends CustomError {
  constructor(message = 'Request Header Fields Too Large', options = {}) {
    super(431, message, { ...options, expose: true, code: 'REQUEST_HEADER_FIELDS_TOO_LARGE' });
  }
}

export class UnavailableForLegalReasons extends CustomError {
  constructor(message = 'Unavailable For Legal Reasons', options = {}) {
    super(451, message, { ...options, expose: true, code: 'UNAVAILABLE_FOR_LEGAL_REASONS' });
  }
}

export class InternalServerError extends CustomError {
  constructor(message = 'Internal Server Error', options = {}) {
    super(500, message, { ...options, expose: true, code: 'INTERNAL_SERVER_ERROR' });
  }
}

export class NotImplemented extends CustomError {
  constructor(message = 'Not Implemented', options = {}) {
    super(501, message, { ...options, expose: true, code: 'NOT_IMPLEMENTED' });
  }
}

export class BadGateway extends CustomError {
  constructor(message = 'Bad Gateway', options = {}) {
    super(502, message, { ...options, expose: true, code: 'BAD_GATEWAY' });
  }
}

export class ServiceUnavailable extends CustomError {
  constructor(message = 'Service Unavailable', options = {}) {
    super(503, message, { ...options, expose: true, code: 'SERVICE_UNAVAILABLE' });
  }
}

export class GatewayTimeout extends CustomError {
  constructor(message = 'Gateway Timeout', options = {}) {
    super(504, message, { ...options, expose: true, code: 'GATEWAY_TIMEOUT' });
  }
}

export class HTTPVersionNotSupported extends CustomError {
  constructor(message = 'HTTP Version Not Supported', options = {}) {
    super(505, message, { ...options, expose: true, code: 'HTTP_VERSION_NOT_SUPPORTED' });
  }
}

export class VariantAlsoNegotiates extends CustomError {
  constructor(message = 'Variant Also Negotiates', options = {}) {
    super(506, message, { ...options, expose: true, code: 'VARIANT_ALSO_NEGOTIATES' });
  }
}

export class InsufficientStorage extends CustomError {
  constructor(message = 'Insufficient Storage', options = {}) {
    super(507, message, { ...options, expose: true, code: 'INSUFFICIENT_STORAGE' });
  }
}

export class LoopDetected extends CustomError {
  constructor(message = 'Loop Detected', options = {}) {
    super(508, message, { ...options, expose: true, code: 'LOOP_DETECTED' });
  }
}

export class BandwidthLimitExceeded extends CustomError {
  constructor(message = 'Bandwidth Limit Exceeded', options = {}) {
    super(509, message, { ...options, expose: true, code: 'BANDWIDTH_LIMIT_EXCEEDED' });
  }
}

export class NotExtended extends CustomError {
  constructor(message = 'Not Extended', options = {}) {
    super(510, message, { ...options, expose: true, code: 'NOT_EXTENDED' });
  }
}

export class NetworkAuthenticationRequired extends CustomError {
  constructor(message = 'Network Authentication Required', options = {}) {
    super(511, message, { ...options, expose: true, code: 'NETWORK_AUTH_REQUIRED' });
  }
}
export class SequelizeError {
  static handleSequelizeError(error, defaultMessage = 'Database operation failed') {    
    if (error instanceof CustomError) {
      return error;
    }
    
    let customError;
    
    switch (error.name) {
      case 'SequelizeValidationError':
        customError = new BadRequest('Validation failed', {
          details: error.errors.map(e => ({
            field: e.path,
            message: e.message
          }))
        });
        break;
      case 'SequelizeUniqueConstraintError':
        customError = new Conflict('Duplicate entry', {
          fields: error.fields,
          message: error.errors[0]?.message || 'Unique constraint violation'
        });
        break;
      case 'SequelizeForeignKeyConstraintError':
        customError = new NotFound('Related resource not found', {
          table: error.table,
          fields: error.fields
        });
        break;
      case 'SequelizeConnectionError':
        customError = new ServiceUnavailable('Database connection failed');
        break;
      default:
        customError = new InternalServerError(defaultMessage, {
          details: error.message,
          stack: error.stack
        });
    }

    return customError;
  }
}