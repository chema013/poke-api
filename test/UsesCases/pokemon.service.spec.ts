import { IPokemonRepository } from '../../src/UsesCases/Interfaces/IPokemonRepository'
import { PokemonService } from '../../src/UsesCases/pokemon.service'

describe('Pokemon Service', () => {
  let pokemonService: PokemonService
  let pokemonRepository: IPokemonRepository

  beforeEach(() => {
    pokemonRepository = {
      findOnePokemon: jest.fn(),
      getPokemons: jest.fn(),
      validateIfPokemonsExists: jest.fn()
    } as IPokemonRepository

    pokemonService = new PokemonService(pokemonRepository)
  })

  describe('Methods of pokemon service', () => {
    it('testing method findAll', async () => {
      const pokemons = [
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/1/'
        },
        {
          name: 'ivysaur',
          url: 'https://pokeapi.co/api/v2/pokemon/2/'
        },
        {
          name: 'venusaur',
          url: 'https://pokeapi.co/api/v2/pokemon/3/'
        }
      ]
      ;(pokemonRepository.getPokemons as jest.Mock).mockResolvedValue(pokemons)

      const response = await pokemonService.findAll(1)

      expect(response[0]).toEqual({
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/'
      })
    })

    it('testing method findOne', async () => {
      const pokemon = {
        id: '1',
        name: 'bulbasaur',
        weight: 69
      }
      ;(pokemonRepository.findOnePokemon as jest.Mock).mockResolvedValue(
        pokemon
      )
      const response = await pokemonService.findOne('some')

      expect(response.name).toEqual('bulbasaur')
    })
  })
})
