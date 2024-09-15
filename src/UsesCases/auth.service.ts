import { Inject, Injectable } from '@nestjs/common'

import { IAuthRepository } from './Interfaces/IAuthRepository'
import { User } from '../Entities/User/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    @Inject(IAuthRepository)
    private readonly iAuthRepository: IAuthRepository
  ) {}

  validateUser(email: string, password: string) {
    return this.iAuthRepository.validateUser(email, password)
  }

  login(user: User) {
    return this.iAuthRepository.login(user)
  }

  refreshToken(user: User) {
    return this.iAuthRepository.refreshToken(user)
  }
}
