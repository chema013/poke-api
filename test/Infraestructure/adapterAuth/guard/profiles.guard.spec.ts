import { ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'

import { ProfilesGuard } from '../../../../src/Infraestructure/adapterAuth/guards/profiles.guard'

describe('ProfilesGuard', () => {
  let guard: ProfilesGuard
  let reflector: Reflector
  let jwtService: JwtService

  beforeEach(() => {
    reflector = new Reflector()
    jwtService = new JwtService({ secret: 'test-secret' })
    guard = new ProfilesGuard(reflector, jwtService)
  })

  const mockExecutionContext = (
    authorizationHeader?: string
  ): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: authorizationHeader
          }
        })
      }),
      getHandler: jest.fn(),
      getClass: jest.fn()
    }) as any

  it('should return true if no profiles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined)
    const context = mockExecutionContext()
    expect(guard.canActivate(context)).toBe(true)
  })

  it('should return false if no authorization header is provided', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin'])
    const context = mockExecutionContext()
    expect(guard.canActivate(context)).toBe(false)
  })

  it('should return true if the user has required profiles', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin'])
    const context = mockExecutionContext('Bearer validToken')

    const mockUser = { profile: ['admin', 'user'] }
    jest.spyOn(jwtService, 'verify').mockReturnValue(mockUser)

    expect(guard.canActivate(context)).toBe(true)
  })

  it('should return false if the user does not have the required profiles', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin'])
    const context = mockExecutionContext('Bearer validToken')

    const mockUser = { profile: ['user'] }
    jest.spyOn(jwtService, 'verify').mockReturnValue(mockUser)

    expect(guard.canActivate(context)).toBe(false)
  })
})
