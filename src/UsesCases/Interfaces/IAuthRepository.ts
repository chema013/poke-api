import { User } from '../../Entities/User/entities/user.entity'

export interface IAuthRepository {
  validateUser(email: string, password: string): Promise<User>
  login(user: User): any
  refreshToken(user: User): any
}

export const IAuthRepository = Symbol('IAuthRepository')
