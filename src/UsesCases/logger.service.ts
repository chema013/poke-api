import * as winston from 'winston'
import { Injectable, LoggerService } from '@nestjs/common'

@Injectable()
export class Logger implements LoggerService {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    })
  }

  log(message: string) {
    this.logger.info(message)
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} -> ${trace}`)
  }

  warn(message: string) {
    this.logger.warn(message)
  }

  debug(message: string) {
    this.logger.debug(message)
  }

  verbose(message: string) {
    this.logger.verbose(message)
  }
}
