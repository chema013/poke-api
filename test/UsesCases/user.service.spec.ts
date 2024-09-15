import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { CreateUserDto } from '../../src/Entities/User/dto/create-user.dto'
import { IAddPokemons } from '../../src/Entities/User/dto/add-pokemons.dto'
import { IPokemonRepository } from '../../src/UsesCases/Interfaces/IPokemonRepository'
import { IUpdatePasswordDto } from '../../src/Entities/User/dto/update-password.dto'
import { IUserRepository } from '../../src/UsesCases/Interfaces/IUserRepository'
import { UpdateUserDto } from '../../src/Entities/User/dto/update-user.dto'
import { UserService } from '../../src/UsesCases/user.service'

describe('UserService', () => {
  let userService: UserService
  let userRepository: IUserRepository
  let pokemonRepository: IPokemonRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: IUserRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            deleteUserByEmail: jest.fn(),
            saveLocation: jest.fn(),
            updatePassword: jest.fn(),
            getNumberOfPokemons: jest.fn(),
            addPokemons: jest.fn(),
            deletePokemon: jest.fn(),
            validatePassword: jest.fn()
          }
        },
        {
          provide: IPokemonRepository,
          useValue: {
            validateIfPokemonsExists: jest.fn()
          }
        }
      ]
    }).compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get<IUserRepository>(IUserRepository)
    pokemonRepository = module.get<IPokemonRepository>(IPokemonRepository)
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'test',
        name: '',
        age: 0,
        lastname: '',
        username: '',
        profile: ''
      }
      const createdUser = { id: 1, email: 'test@example.com' }
      jest.spyOn(userRepository, 'create').mockResolvedValue(createdUser)

      const result = await userService.create(createUserDto)

      expect(userRepository.create).toHaveBeenCalledWith(createUserDto)
      expect(result).toEqual(createdUser)
    })
  })

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com'
      const user = [{ id: 1, email }]
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user)

      const result = await userService.findOne(email)

      expect(userRepository.findOne).toHaveBeenCalledWith(email, undefined)
      expect(result).toEqual(user[0])
    })

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue([])

      await expect(userService.findOne('notfound@example.com')).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const email = 'test@example.com'
      const updateUserDto: UpdateUserDto = { name: 'Updated' }
      const updatedUser = { id: 1, email, name: 'Updated' }
      jest.spyOn(userRepository, 'update').mockResolvedValue(updatedUser)

      const result = await userService.update(email, updateUserDto)

      expect(userRepository.update).toHaveBeenCalledWith(email, updateUserDto)
      expect(result).toEqual(updatedUser)
    })
  })

  describe('addPokemons', () => {
    it('should throw BadRequestException if user already has 6 pokemons', async () => {
      const pokemons: IAddPokemons = {
        pokemons: [
          {
            name: 'Pikachu',
            id: 0,
            weight: 0
          }
        ]
      }
      jest.spyOn(userRepository, 'getNumberOfPokemons').mockResolvedValue(6)

      await expect(
        userService.addPokemons(pokemons, 'test@example.com')
      ).rejects.toThrow(BadRequestException)
    })

    it('should add pokemons to the user if validations pass', async () => {
      const pokemons: IAddPokemons = {
        pokemons: [
          {
            name: 'Pikachu',
            id: 0,
            weight: 0
          }
        ]
      }
      jest.spyOn(userRepository, 'getNumberOfPokemons').mockResolvedValue(2)
      jest.spyOn(userRepository, 'addPokemons').mockResolvedValue(true)
      jest
        .spyOn(pokemonRepository, 'validateIfPokemonsExists')
        .mockResolvedValue(undefined)

      const result = await userService.addPokemons(pokemons, 'test@example.com')

      expect(pokemonRepository.validateIfPokemonsExists).toHaveBeenCalledWith(
        pokemons.pokemons
      )
      expect(userRepository.addPokemons).toHaveBeenCalledWith(
        pokemons.pokemons,
        'test@example.com'
      )
      expect(result).toBe(true)
    })
  })

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const email = 'test@example.com'
      const updatePasswordDto: IUpdatePasswordDto = { password: 'newpassword' }
      jest.spyOn(userRepository, 'updatePassword').mockResolvedValue(true)

      const result = await userService.updatePassword(email, updatePasswordDto)

      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        email,
        updatePasswordDto
      )
      expect(result).toBe(true)
    })
  })

  describe('deletePokemon', () => {
    it('should delete a pokemon from the user', async () => {
      const email = 'test@example.com'
      const pokemonName = 'Pikachu'
      jest.spyOn(userRepository, 'deletePokemon').mockResolvedValue(true)

      const result = await userService.deletePokemon(email, pokemonName)

      expect(userRepository.deletePokemon).toHaveBeenCalledWith(
        email,
        pokemonName
      )
      expect(result).toBe(true)
    })
  })
})
