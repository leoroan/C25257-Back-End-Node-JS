import winston, { transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import picocolors from 'picocolors';

const { cyan, red, yellow, blue, white, magenta, green, gray } = picocolors;

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
    success: 6,
    trace: 7
  },
  colors: {
    fatal: 'cyan',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'white',
    debug: 'magenta',
    success: 'green',
    trace: 'gray'
  }
}

winston.addColors(customLevelsOptions.colors)

const colorize = (level, message) => {
  switch (level) {
    case 'fatal':
      return cyan(message);
    case 'error':
      return red(message);
    case 'warning':
      return yellow(message);
    case 'info':
      return blue(message);
    case 'http':
      return white(message);
    case 'debug':
      return magenta(message);
    case 'success':
      return green(message);
    case 'trace':
      return gray(message);
    default:
      return message;
  }
};

const formatLog = winston.format.printf(({ timestamp, level, message, ...metadata }) => {
  let log = `${timestamp} [${level}]: ${colorize(level, message)}`;
  if (Object.keys(metadata).length) {
    log += ` ${JSON.stringify(metadata)} `;
  }
  return log;
});

export const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new transports.Console({
      level: 'debug'
    }),
    new DailyRotateFile({
      filename: 'logs/dev/dev_errors-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m', // Tamaño máximo de cada archivo de log
      maxFiles: '30d' // Eliminar archivos más viejos que 30 días
    }),
    new DailyRotateFile({
      filename: 'logs/dev/dev_general-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      level: 'info',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    formatLog
  )
})

export const prodLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new transports.Console({
      level: 'info'
    }),
    new DailyRotateFile({
      filename: 'logs/prod/error-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m', // Tamaño máximo de cada archivo de log
      maxFiles: '30d' // Eliminar archivos más viejos que 30 días
    }),
    new DailyRotateFile({
      filename: 'logs/prod/info-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      level: 'info',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    formatLog
  )
})
