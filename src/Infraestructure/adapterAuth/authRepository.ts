import { JwtService } from '@nestjs/jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { IAuthRepository } from '../../UsesCases/Interfaces/IAuthRepository'
import { User } from '../../Entities/User/entities/user.entity'
import { UserService } from '../../UsesCases/user.service'

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(email, true)

    if (
      user &&
      (await this.usersService.validatePassword(password, user.password))
    ) {
      return user
    }
    throw new UnauthorizedException('Invalid credentials')
  }

  login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      profile: user.profile
    }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })
    user.refreshToken = refreshToken

    return {
      accessToken,
      refreshToken
    }
  }

  refreshToken(user: User) {
    const payload = { username: user.username, sub: user.id }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' })

    return { accessToken }
  }
}
