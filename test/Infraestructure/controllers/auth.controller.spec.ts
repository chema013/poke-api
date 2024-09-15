import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AuthController } from '../../../src/Infraestructure/controllers/auth.controller'
import { AuthService } from '../../../src/UsesCases/auth.service'
import { Logger } from '../../../src/UsesCases/logger.service'
import { LoginDto } from '../../../src/Entities/auth/dto/login.dto'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService
  let logger: Logger

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn()
          }
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            log: jest.fn()
          }
        }
      ]
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
    logger = module.get<Logger>(Logger)
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  describe('login', () => {
    it('should return a valid auth response when credentials are correct', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'test' }
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'string',
        age: 1,
        lastname: 'string',
        username: 'string',
        password: '1234',
        profile: 'string',
        pokemons: []
      }
      const loginResponse = {
        accessToken: 'valid-token',
        refreshToken: 'valid-refresh-token'
      }

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user)
      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse)

      const result = await authController.login(loginDto)

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      )
      expect(authService.login).toHaveBeenCalledWith(user)
      expect(result).toEqual(loginResponse)
    })

    it('should throw ForbiddenException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password'
      }
      jest.spyOn(authService, 'validateUser').mockImplementation(() => {
        throw new Error('Invalid credentials')
      })

      await expect(authController.login(loginDto)).rejects.toThrow(
        ForbiddenException
      )
      expect(logger.error).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('refresh', () => {
    it('should refresh token successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' }
      const refreshResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      }
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(refreshResponse)

      const req = { user: mockUser }
      const result = await authController.refresh(req)

      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(refreshResponse)
    })
  })
})
