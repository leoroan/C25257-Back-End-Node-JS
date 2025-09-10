import { devLogger } from '../../config/logger/logger.config.js';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

export default class LogsService {
  constructor() {
  }

  async listLogs(mode) {
    try {
      const logsDir = path.resolve('logs/', mode);
      return await fsPromises.readdir(logsDir);
    } catch (error) {
      devLogger.debug(error)
      throw (error);
    }
  }

  async getLog(mode, filename) {
    try {
      const logsDir = path.resolve('logs/', mode, filename);
      const log = await fsPromises.readFile(logsDir, 'utf-8');
      return log;
    } catch (error) {
      devLogger.debug(error)
      throw (error);
    }
  }

  async downloadLog(res, mode, filename) {
    try {
      const logsDir = path.resolve('logs/', mode, filename);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'text/plain'); 
      const fileStream = fs.createReadStream(logsDir);
      fileStream.pipe(res);
    } catch (error) {
      devLogger.debug(error)
      throw (error);
    }
  }
};

