import axios from 'axios'
import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { Logger } from '../../../src/UsesCases/logger.service'
import { PokemonRepository } from '../../../src/Infraestructure/adapterPokemon/pokemonRepository'

jest.mock('axios')

describe('PokemonRepository', () => {
  let pokemonRepository: PokemonRepository
  let logger: Logger

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonRepository,
        Logger,
        { provide: Logger, useValue: mockLogger }
      ]
    }).compile()

    pokemonRepository = module.get<PokemonRepository>(PokemonRepository)
    logger = module.get<Logger>(Logger)
  })

  describe('Methods of pokemon repository', () => {
    it('Testign method getPokemons successful', async () => {
      const mockResponse = {
        data: { results: [{ name: 'pikachu', id: 25, weight: 60 }] }
      }
      ;(axios.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await pokemonRepository.getPokemons(1, 1)

      expect(result).toEqual({
        currentPage: 1,
        data: [{ id: 25, name: 'pikachu', weight: 60 }],
        totalPages: 1
      })
    })

    it('Testign method findOnePokemon successful', async () => {
      const mockResponse = {
        data: { id: 1, name: 'someName', weight: 69 }
      }
      ;(axios.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await pokemonRepository.findOnePokemon('someName')

      expect(result).toEqual({ id: 1, name: 'someName', weight: 69 })
    })

    it('Testign method findOnePokemon error', async () => {
      ;(axios.get as jest.Mock).mockRejectedValue(new Error())

      await expect(
        pokemonRepository.findOnePokemon('someName')
      ).rejects.toThrow('Error al obtener el pokemon: someName')
    })

    it('Testign method findOnePokemon error 404', async () => {
      ;(axios.get as jest.Mock).mockRejectedValue({
        status: 404,
        data: {
          message: 'Not Found'
        }
      })

      await expect(
        pokemonRepository.findOnePokemon('someName')
      ).rejects.toThrow('Pokemon no encontrado: someName')
    })

    it('Testign method fetchAndStorePokemons error', async () => {
      ;(axios.get as jest.Mock).mockRejectedValue(new Error())

      await expect(pokemonRepository.fetchAndStorePokemons()).rejects.toThrow(
        'Error al obtener los pokémones'
      )
    })

    it('debería pasar cuando todos los Pokémon existen', async () => {
      const pokemons = [
        { name: 'bulbasaur', id: 1, weight: 68 },
        { name: 'pikachu', id: 1, weight: 68 }
      ]

      jest.spyOn(pokemonRepository, 'findOnePokemon').mockResolvedValue(true)

      await expect(
        pokemonRepository.validateIfPokemonsExists(pokemons)
      ).resolves.not.toThrow()
      expect(pokemonRepository.findOnePokemon).toHaveBeenCalledTimes(2)
    })

    it('debería lanzar un error cuando algunos Pokémon no existen', async () => {
      const pokemons = [
        { name: 'bulbasaur', id: 1, weight: 68 },
        { name: 'charmander', id: 1, weight: 68 }
      ]

      jest
        .spyOn(pokemonRepository, 'findOnePokemon')
        .mockImplementationOnce(() => Promise.resolve(true))
        .mockImplementationOnce(() => Promise.reject(new Error('Not found')))

      await expect(
        pokemonRepository.validateIfPokemonsExists(pokemons)
      ).rejects.toThrow(BadRequestException)
      expect(pokemonRepository.findOnePokemon).toHaveBeenCalledTimes(2)
      expect(logger.error).toHaveBeenCalledWith(
        'Los siguientes pokemons no existen en pokeApi: charmander'
      )
    })

    it('debería lanzar un error cuando todos los Pokémon no existen', async () => {
      const pokemons = [
        { name: 'missingno', id: 1, weight: 68 },
        { name: 'unknown', id: 1, weight: 68 }
      ]

      jest
        .spyOn(pokemonRepository, 'findOnePokemon')
        .mockRejectedValue(new Error('Not found'))

      await expect(
        pokemonRepository.validateIfPokemonsExists(pokemons)
      ).rejects.toThrow(BadRequestException)
      expect(pokemonRepository.findOnePokemon).toHaveBeenCalledTimes(2)
      expect(logger.error).toHaveBeenCalledWith(
        'Los siguientes pokemons no existen en pokeApi: missingno, unknown'
      )
    })

    it('debería registrar un error cuando algunos Pokémon fallan pero continuar con los demás', async () => {
      const pokemons = [
        { name: 'bulbasaur', id: 1, weight: 68 },
        { name: 'unknown', id: 1, weight: 68 }
      ]

      jest
        .spyOn(pokemonRepository, 'findOnePokemon')
        .mockImplementationOnce(() => Promise.resolve(true))
        .mockImplementationOnce(() => Promise.reject(new Error('Not found')))

      await expect(
        pokemonRepository.validateIfPokemonsExists(pokemons)
      ).rejects.toThrow(BadRequestException)
      expect(pokemonRepository.findOnePokemon).toHaveBeenCalledTimes(2)
      expect(logger.error).toHaveBeenCalledWith(
        'Los siguientes pokemons no existen en pokeApi: unknown'
      )
    })
  })
})
