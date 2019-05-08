import * as winston from 'winston'
import * as path from 'path'
const config = require('../config')

const errorLogPath = path.join(config.logPath, 'error.log')
const combinedLogPath = path.join(config.logPath, 'combined.log')

export const siadLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'siad' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: errorLogPath, level: 'error' }),
    new winston.transports.File({ filename: combinedLogPath })
  ]
})

siadLogger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple())
  })
)
