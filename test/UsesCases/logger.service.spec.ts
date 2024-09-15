import * as winston from 'winston'

import { Logger } from '../../src/UsesCases/logger.service'

describe('Logger Service', () => {
  let loggerService: Logger
  let mockLogger: winston.Logger

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn()
    } as unknown as winston.Logger

    loggerService = new Logger()
    ;(loggerService as any).logger = mockLogger
  })

  it('should log messages using info method', () => {
    const message = 'Info message'
    loggerService.log(message)
    expect(mockLogger.info).toHaveBeenCalledWith(message)
  })

  it('should log errors using error method', () => {
    const message = 'Error message'
    const trace = 'Error trace'
    loggerService.error(message, trace)
    expect(mockLogger.error).toHaveBeenCalledWith(`${message} -> ${trace}`)
  })

  it('should log warnings using warn method', () => {
    const message = 'Warning message'
    loggerService.warn(message)
    expect(mockLogger.warn).toHaveBeenCalledWith(message)
  })

  it('should log debug messages using debug method', () => {
    const message = 'Debug message'
    loggerService.debug(message)
    expect(mockLogger.debug).toHaveBeenCalledWith(message)
  })

  it('should log verbose messages using verbose method', () => {
    const message = 'Verbose message'
    loggerService.verbose(message)
    expect(mockLogger.verbose).toHaveBeenCalledWith(message)
  })
})
