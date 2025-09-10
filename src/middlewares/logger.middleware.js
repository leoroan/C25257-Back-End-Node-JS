import { devLogger, prodLogger } from '../config/logger/logger.config.js'
import config from '../config/configuration.js'

export const addLogger = (req, res, next) => {
  const logger = config.environment === 'DESARROLLO' ? devLogger : prodLogger
  const { method, url, query, params, body } = req

  if (res) {
    const originalSend = res.send
    res.send = function (body) {
      const responseBody = body instanceof Buffer ? 'Buffer' : body      
      const { payload, ...rest } = JSON.parse(responseBody);

      const logInfo = {
        statusCode: res.statusCode,
        body: rest
      }

      logger.info('Response sent ', logInfo)
      originalSend.apply(res, arguments)
    }
  }

  const logInfo = {
    method,
    url,
    query: Object.keys(query).length ? query : 'Empty',
    params: Object.keys(params).length ? params : 'Empty',
    body: (body && Object.keys(body).length) ? body : 'Empty'
  }

  const filteredEmptysLogInfo = Object.fromEntries(
    url == '/api/session/login' ?
      Object.entries({ ...logInfo, body: 'sory, no password for you' }).filter(([_, v]) => v !== 'Empty') :
      Object.entries(logInfo).filter(([_, v]) => v !== 'Empty')
  )

  logger.info('Request received ', filteredEmptysLogInfo)
  next()
}