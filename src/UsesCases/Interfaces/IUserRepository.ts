import { ISavePokemonsDto } from '../../Entities/pokemon/dto/createPokemon.dto'
import { IUpdatePasswordDto } from '../../Entities/User/dto/update-password.dto'
import {
  CreateUserDto,
  ICreateUserDto
} from '../../Entities/User/dto/create-user.dto'

export interface IUserRepository {
  create(createUserDto: ICreateUserDto): any
  findAll(page: number, pageSize?: number): any
  findOne(email: string, includePassword?: boolean): any
  update(email: string, updateUserDto: Partial<CreateUserDto>): any
  deleteUserByEmail(email: string): any
  validatePassword(password: string, hash: string): Promise<boolean>
  saveLocation(location: object, email: string): any
  updatePassword(email: string, updatePasswordDto: IUpdatePasswordDto): any
  addPokemons(pokemons: ISavePokemonsDto[], email: string): any
  getNumberOfPokemons(email: string): Promise<number>
  deletePokemon(email: string, name: string): any
}

export const IUserRepository = Symbol('IUserRepository')
