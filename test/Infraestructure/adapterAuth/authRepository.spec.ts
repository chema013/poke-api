import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { AuthRepository } from '../../../src/Infraestructure/adapterAuth/authRepository'
import { User } from '../../../src/Entities/User/entities/user.entity'
import { UserService } from '../../../src/UsesCases/user.service'

describe('AuthRepository', () => {
  let authRepository: AuthRepository

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'hashedPassword',
    profile: 'user',
    refreshToken: 'refreshToken'
  } as User

  const mockUserService = {
    findOne: jest.fn(),
    validatePassword: jest.fn()
  }

  const mockJwtService = {
    sign: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService }
      ]
    }).compile()

    authRepository = module.get<AuthRepository>(AuthRepository)
  })

  describe('validateUser', () => {
    it('should return a user if validation is successful', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser)
      mockUserService.validatePassword.mockResolvedValue(true)

      const result = await authRepository.validateUser(
        mockUser.email,
        'password'
      )

      expect(mockUserService.findOne).toHaveBeenCalledWith(mockUser.email, true)
      expect(mockUserService.validatePassword).toHaveBeenCalledWith(
        'password',
        mockUser.password
      )
      expect(result).toEqual(mockUser)
    })

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserService.findOne.mockResolvedValue(null)

      await expect(
        authRepository.validateUser(mockUser.email, 'password')
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if password validation fails', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser)
      mockUserService.validatePassword.mockResolvedValue(false)

      await expect(
        authRepository.validateUser(mockUser.email, 'password')
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('login', () => {
    it('should return accessToken and refreshToken', () => {
      mockJwtService.sign.mockReturnValue('accessToken')
      const result = authRepository.login(mockUser)

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
        profile: mockUser.profile
      })
      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'accessToken'
      })
    })

    it('should set refreshToken on the user object', () => {
      mockJwtService.sign.mockReturnValue('refreshToken')
      authRepository.login(mockUser)

      expect(mockUser.refreshToken).toEqual('refreshToken')
    })
  })

  describe('refreshToken', () => {
    it('should return a new accessToken', () => {
      mockJwtService.sign.mockReturnValue('newAccessToken')
      const result = authRepository.refreshToken(mockUser)

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { username: mockUser.username, sub: mockUser.id },
        { expiresIn: '1h' }
      )
      expect(result).toEqual({ accessToken: 'newAccessToken' })
    })
  })
})
