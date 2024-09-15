import { Inject, Injectable } from '@nestjs/common'

import { IPokemonRepository } from './Interfaces/IPokemonRepository'

@Injectable()
export class PokemonService {
  constructor(
    @Inject(IPokemonRepository)
    private readonly pokemonRepository: IPokemonRepository
  ) {}

  findAll(page: number) {
    return this.pokemonRepository.getPokemons(page)
  }

  async findOne(name: string) {
    const pokemon = await this.pokemonRepository.findOnePokemon(name)

    return pokemon
  }
}
