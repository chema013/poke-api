import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class ProfilesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredProfiles = this.reflector.get<string[]>(
      'profiles',
      context.getHandler()
    )
    if (!requiredProfiles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const {
      headers: { authorization: authHeader }
    } = request

    if (!authHeader) {
      return false
    }

    const token = authHeader.split(' ')[1]
    const user = this.jwtService.verify(token)

    return requiredProfiles.some(profile => user.profile.includes(profile))
  }
}
