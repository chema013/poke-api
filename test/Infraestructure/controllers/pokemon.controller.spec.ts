import { Test, TestingModule } from '@nestjs/testing'

import { NameParamDto } from '../../../src/Entities/pokemon/dto/name.dto'
import { PaginationDto } from '../../../src/Entities/pokemon/dto/pagination.dto'
import { PokemonController } from '../../../src/Infraestructure/controllers/pokemon.controller'
import { PokemonService } from '../../../src/UsesCases/pokemon.service'

describe('PokemonController', () => {
  let pokemonController: PokemonController
  let pokemonService: PokemonService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile()

    pokemonController = module.get<PokemonController>(PokemonController)
    pokemonService = module.get<PokemonService>(PokemonService)
  })

  it('should be defined', () => {
    expect(pokemonController).toBeDefined()
  })

  describe('findAll', () => {
    it('should return a paginated list of pokemons', async () => {
      const paginationDto: PaginationDto = { page: 1 }
      const paginatedResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
        ],
        count: 1,
        next: null,
        previous: null
      }

      jest.spyOn(pokemonService, 'findAll').mockResolvedValue(paginatedResponse)

      const result = await pokemonController.findAll(paginationDto)

      expect(pokemonService.findAll).toHaveBeenCalledWith(1)
      expect(result).toEqual(paginatedResponse)
    })

    it('should default to page 1 if page query param is missing or invalid', async () => {
      const paginatedResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
        ],
        count: 1,
        next: null,
        previous: null
      }

      jest.spyOn(pokemonService, 'findAll').mockResolvedValue(paginatedResponse)

      const result = await pokemonController.findAll({
        page: null
      } as PaginationDto)
      expect(pokemonService.findAll).toHaveBeenCalledWith(1)
      expect(result).toEqual(paginatedResponse)
    })

    it('should handle invalid page numbers by defaulting to 1', async () => {
      const paginatedResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
        ],
        count: 1,
        next: null,
        previous: null
      }

      jest.spyOn(pokemonService, 'findAll').mockResolvedValue(paginatedResponse)

      const result = await pokemonController.findAll({
        page: -1
      } as PaginationDto)
      expect(pokemonService.findAll).toHaveBeenCalledWith(1)
      expect(result).toEqual(paginatedResponse)
    })
  })

  describe('findOne', () => {
    it('should return a single pokemon by name', async () => {
      const nameDto: NameParamDto = { name: 'bulbasaur' }
      const pokemon = {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/'
      }

      jest.spyOn(pokemonService, 'findOne').mockResolvedValue(pokemon)

      const result = await pokemonController.findOne(nameDto)

      expect(pokemonService.findOne).toHaveBeenCalledWith('bulbasaur')
      expect(result).toEqual(pokemon)
    })
  })
})
