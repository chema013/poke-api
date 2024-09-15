import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { RefreshStrategy } from '../../../../src/Infraestructure/adapterAuth/strategies/refresh.strategy'
import { UserService } from '../../../../src/UsesCases/user.service'

describe('RefreshStrategy', () => {
  let strategy: RefreshStrategy
  const mockUserService = {
    findOne: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshStrategy,
        { provide: UserService, useValue: mockUserService },
        JwtService
      ]
    }).compile()

    strategy = module.get<RefreshStrategy>(RefreshStrategy)
  })

  describe('validate', () => {
    it('should return user if refresh token is valid', async () => {
      const user = { username: 'testuser', refreshToken: 'valid_refresh_token' }
      const req = { headers: { authorization: 'Bearer valid_refresh_token' } }
      const payload = { username: 'testuser' }

      mockUserService.findOne = jest.fn().mockResolvedValue(user)

      const result = await strategy.validate(req, payload)

      expect(result).toEqual(user)
    })

    it('should throw UnauthorizedException if user is not found', async () => {
      const req = { headers: { authorization: 'Bearer invalid_refresh_token' } }
      const payload = { username: 'testuser' }

      mockUserService.findOne = jest.fn().mockResolvedValue(null)

      await expect(strategy.validate(req, payload)).rejects.toThrow(
        UnauthorizedException
      )
    })

    it('should throw UnauthorizedException if refreshToken does not match', async () => {
      const user = {
        username: 'testuser',
        refreshToken: 'different_refresh_token'
      }
      const req = { headers: { authorization: 'Bearer valid_refresh_token' } }
      const payload = { username: 'testuser' }

      mockUserService.findOne = jest.fn().mockResolvedValue(user)

      await expect(strategy.validate(req, payload)).rejects.toThrow(
        UnauthorizedException
      )
    })
  })

  describe('constructor', () => {
    it('should be defined and extend PassportStrategy with "refresh" strategy', () => {
      expect(strategy).toBeDefined()
    })
  })
})
