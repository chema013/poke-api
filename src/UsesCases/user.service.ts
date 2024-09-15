import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'

import { CreateUserDto } from '../Entities/User/dto/create-user.dto'
import { IAddPokemons } from '../Entities/User/dto/add-pokemons.dto'
import { IPokemonRepository } from './Interfaces/IPokemonRepository'
import { IUpdatePasswordDto } from '../Entities/User/dto/update-password.dto'
import { IUserRepository } from './Interfaces/IUserRepository'
import { UpdateUserDto } from '../Entities/User/dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @Inject(IUserRepository)
    private readonly iUserRepository: IUserRepository,

    @Inject(IPokemonRepository)
    private readonly pokemonRepository: IPokemonRepository
  ) {}

  async create(createUserDto: CreateUserDto) {
    const response = await this.iUserRepository.create(createUserDto)

    return response
  }

  findAll(page: number) {
    return this.iUserRepository.findAll(page)
  }

  async findOne(email: string, includePassword?: boolean) {
    const user = await this.iUserRepository.findOne(email, includePassword)

    if (user.length <= 0) {
      throw new NotFoundException('El usuario no existe')
    }

    return user[0]
  }

  update(email: string, updateUserDto: UpdateUserDto) {
    return this.iUserRepository.update(email, updateUserDto)
  }

  remove(email: string) {
    return this.iUserRepository.deleteUserByEmail(email)
  }

  saveLocation(location: object, email: string) {
    return this.iUserRepository.saveLocation(location, email)
  }

  updatePassword(email: string, updatePasswordDto: IUpdatePasswordDto) {
    return this.iUserRepository.updatePassword(email, updatePasswordDto)
  }

  async addPokemons(pokemons: IAddPokemons, email: string) {
    await this.pokemonRepository.validateIfPokemonsExists(pokemons.pokemons)

    const numberOfPokemons =
      await this.iUserRepository.getNumberOfPokemons(email)
    const {
      pokemons: { length: pokemonsToAddSize }
    } = pokemons

    if (numberOfPokemons >= 6) {
      throw new BadRequestException('Ya tienes el número máximo de pokemons.')
    }

    const totalPokemons = numberOfPokemons + pokemonsToAddSize

    if (totalPokemons > 6) {
      throw new BadRequestException(
        `No puedes tener mas de 6 pokemons ya tienes: ${numberOfPokemons} y quieres guardar: ${pokemonsToAddSize}. Elimina: ${totalPokemons - 6} pokemons.`
      )
    }

    if (totalPokemons < 3) {
      throw new BadRequestException(`Se necesita tener al menos 3 pokemons`)
    }

    return this.iUserRepository.addPokemons(pokemons.pokemons, email)
  }

  deletePokemon(email: string, name: string) {
    return this.iUserRepository.deletePokemon(email, name)
  }

  /* Metodos para auth */
  validatePassword(password: string, hash: string): Promise<boolean> {
    return this.iUserRepository.validatePassword(password, hash)
  }
}
