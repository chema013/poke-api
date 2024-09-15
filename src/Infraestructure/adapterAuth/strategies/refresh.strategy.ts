import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { UserService } from '../../../UsesCases/user.service'

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'SECRET_KEY',
      passReqToCallback: true
    })
  }

  async validate(req: any, payload: any) {
    const refreshToken = req.headers.authorization.replace('Bearer ', '')
    const user = await this.usersService.findOne(payload.username)
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException()
    }
    return user
  }
}
