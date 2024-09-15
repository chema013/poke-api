import axios from 'axios'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'

import { IPokemonRepository } from '../../UsesCases/Interfaces/IPokemonRepository'
import { ISavePokemonsDto } from '../../Entities/pokemon/dto/createPokemon.dto'
import { Logger } from '../../UsesCases/logger.service'
import { SERVICE_DOMAINS } from '../../common/constants'

@Injectable()
export class PokemonRepository implements IPokemonRepository {
  private pokemons: any[] = []

  constructor(private readonly logger: Logger) {}

  async getPokemons(page: number, pageSize: number = 11): Promise<any> {
    const start = (page - 1) * pageSize
    const end = start + pageSize

    if (this.pokemons.length <= 0) {
      await this.fetchAndStorePokemons()
    }

    const paginatedPokemons = this.pokemons.slice(start, end)

    return {
      currentPage: page,
      totalPages: Math.ceil(this.pokemons.length / pageSize),
      data: paginatedPokemons
    }
  }

  async findOnePokemon(name: string) {
    try {
      const response = await axios.get(
        `${SERVICE_DOMAINS.POKEAPI_URL}/api/v2/pokemon/${name}`
      )

      return response.data
    } catch (error) {
      this.logger.error(`Error al obtener el pokemon: ${name}`, error)
      if (error.status === 404) {
        throw new NotFoundException(`Pokemon no encontrado: ${name}`)
      }
      throw new InternalServerErrorException(
        `Error al obtener el pokemon: ${name}`
      )
    }
  }

  async fetchAndStorePokemons(): Promise<void> {
    try {
      const response = await axios.get(
        `${SERVICE_DOMAINS.POKEAPI_URL}/api/v2/pokemon?limit=10000`
      )

      this.pokemons = response.data.results
    } catch (error) {
      this.logger.error('Error al obtener los pokémones:', error)
      throw new InternalServerErrorException('Error al obtener los pokémones')
    }
  }

  async validateIfPokemonsExists(pokemons: ISavePokemonsDto[]): Promise<void> {
    const promises = pokemons.map(pokemon => {
      const { name: pokemonName } = pokemon
      return this.findOnePokemon(pokemonName)
        .then(() => ({ success: true, name: pokemonName }))
        .catch(() => ({ success: false, name: pokemonName }))
    })

    const results = await Promise.allSettled(promises)

    const failedPokemons = results
      .filter(result => result.status === 'fulfilled' && !result.value.success)
      .map(
        result =>
          (result as PromiseFulfilledResult<{ success: boolean; name: string }>)
            .value.name
      )

    if (failedPokemons.length > 0) {
      this.logger.error(
        `Los siguientes pokemons no existen en pokeApi: ${failedPokemons.join(', ')}`
      )
      throw new BadRequestException(
        `Los siguientes pokemons no existen en pokeApi: ${failedPokemons.join(', ')}`
      )
    }
  }
}
