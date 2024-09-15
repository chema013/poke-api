import { ISavePokemonsDto } from '../../Entities/pokemon/dto/createPokemon.dto'

export interface IPokemonRepository {
  findOnePokemon(name: string): any
  getPokemons(page: number, pageSize?: number): any
  validateIfPokemonsExists(pokemons: ISavePokemonsDto[]): any
}

export const IPokemonRepository = Symbol('IPokemonRepository')
