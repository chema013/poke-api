import { AuthService } from '../../src/UsesCases/auth.service'
import { IAuthRepository } from '../../src/UsesCases/Interfaces/IAuthRepository'
import { User } from '../../src/Entities/User/entities/user.entity'

describe('AuthService', () => {
  let authService: AuthService
  let authRepository: IAuthRepository

  beforeEach(() => {
    authRepository = {
      validateUser: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn()
    } as unknown as IAuthRepository

    authService = new AuthService(authRepository)
  })

  describe('validateUser', () => {
    it('should call validateUser on the repository with the correct parameters', async () => {
      const email = 'test@example.com'
      const password = 'password'
      const user = { id: '1', email } as unknown as User
      ;(authRepository.validateUser as jest.Mock).mockResolvedValue(user)

      await authService.validateUser(email, password)

      expect(authRepository.validateUser).toHaveBeenCalledWith(email, password)
    })
  })

  describe('login', () => {
    it('should call login on the repository with the correct parameters', async () => {
      const user = { id: '1', email: 'test@example.com' } as unknown as User
      const response = { accessToken: 'token', refreshToken: 'refreshToken' }
      ;(authRepository.login as jest.Mock).mockResolvedValue(response)

      const result = await authService.login(user)

      expect(authRepository.login).toHaveBeenCalledWith(user)
      expect(result).toEqual(response)
    })
  })

  describe('refreshToken', () => {
    it('should call refreshToken on the repository with the correct parameters', async () => {
      const user = { id: '1', email: 'test@example.com' } as unknown as User
      const response = { accessToken: 'newToken' }
      ;(authRepository.refreshToken as jest.Mock).mockResolvedValue(response)

      const result = await authService.refreshToken(user)

      expect(authRepository.refreshToken).toHaveBeenCalledWith(user)
      expect(result).toEqual(response)
    })
  })
})
