import { Test, TestingModule } from '@nestjs/testing'

import { AddPokemonsDto } from '../../../src/Entities/User/dto/add-pokemons.dto'
import { CreateUserDto } from '../../../src/Entities/User/dto/create-user.dto'
import { DeletePokemonParamDto } from '../../../src/Entities/User/dto/deletePokemon.dto'
import { EmailParamDto } from '../../../src/Entities/User/dto/email.dto'
import { JwtAuthGuard } from '../../../src/Infraestructure/adapterAuth/guards/jwt-auth.guard'
import { PaginationDto } from '../../../src/Entities/pokemon/dto/pagination.dto'
import { ProfilesGuard } from '../../../src/Infraestructure/adapterAuth/guards/profiles.guard'
import { SaveLocationDto } from '../../../src/Entities/User/dto/saveLocation.dto'
import { UpdatePasswordDto } from '../../../src/Entities/User/dto/update-password.dto'
import { UpdateUserDto } from '../../../src/Entities/User/dto/update-user.dto'
import { UserController } from '../../../src/Infraestructure/controllers/user.controller'
import { UserService } from '../../../src/UsesCases/user.service'

describe('UserController', () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            saveLocation: jest.fn(),
            addPokemons: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
            remove: jest.fn(),
            deletePokemon: jest.fn()
          }
        }
      ]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(ProfilesGuard)
      .useValue({})
      .compile()

    userController = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(userController).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: '',
        age: 0,
        lastname: '',
        username: '',
        profile: ''
      }
      const createdUser = { id: '1', ...createUserDto }

      jest.spyOn(userService, 'create').mockResolvedValue(createdUser)

      const result = await userController.create(createUserDto)

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        password: 'password',
        name: '',
        age: 0,
        lastname: '',
        username: '',
        profile: ''
      })
    })
  })

  describe('saveLocation', () => {
    it('should save location for a user', async () => {
      const emailParam: EmailParamDto = { email: 'test@example.com' }
      const saveLocationDto: SaveLocationDto = {
        location: { latitude: 10, longitude: 20 }
      }
      const updatedUser = {
        email: 'test@example.com',
        location: saveLocationDto
      }

      jest.spyOn(userService, 'saveLocation').mockResolvedValue(updatedUser)

      const result = await userController.saveLocation(
        emailParam,
        saveLocationDto
      )

      expect(result).toEqual({
        email: 'test@example.com',
        location: { location: { latitude: 10, longitude: 20 } }
      })
    })
  })

  describe('savePokemons', () => {
    it('should add pokemons to a user', async () => {
      const emailParam: EmailParamDto = { email: 'test@example.com' }
      const addPokemonsDto: AddPokemonsDto = {
        pokemons: [
          {
            name: 'venusaur',
            id: 35,
            weight: 75
          }
        ]
      }
      const updatedUser = {
        email: 'test@example.com',
        pokemons: addPokemonsDto.pokemons
      }

      jest.spyOn(userService, 'addPokemons').mockResolvedValue(updatedUser)

      const result = await userController.savePokemons(
        emailParam,
        addPokemonsDto
      )

      expect(result).toEqual({
        email: 'test@example.com',
        pokemons: [{ name: 'venusaur', id: 35, weight: 75 }]
      })
    })
  })

  describe('findAll', () => {
    it('should return a paginated list of users', async () => {
      const paginationDto: PaginationDto = { page: 1 }
      const paginatedUsers = {
        users: [{ email: 'test@example.com' }],
        total: 1
      }

      jest.spyOn(userService, 'findAll').mockResolvedValue(paginatedUsers)

      const result = await userController.findAll(paginationDto)

      expect(result).toEqual({
        users: [{ email: 'test@example.com' }],
        total: 1
      })
    })
  })

  describe('findOne', () => {
    it('should return a single user by email', async () => {
      const emailParam: EmailParamDto = { email: 'test@example.com' }
      const user = { email: 'test@example.com' }

      jest.spyOn(userService, 'findOne').mockResolvedValue(user)

      const result = await userController.findOne(emailParam)

      expect(result).toEqual({ email: 'test@example.com' })
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const emailParam: EmailParamDto = { email: 'test@example.com' }
      const updateUserDto: UpdateUserDto = {
        name: 'John',
        lastname: 'Doe'
      }
      const updatedUser = { email: 'test@example.com', ...updateUserDto }

      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser)

      const result = await userController.update(emailParam, updateUserDto)

      expect(result).toEqual({
        email: 'test@example.com',
        name: 'John',
        lastname: 'Doe'
      })
    })
  })

  describe('updatePass', () => {
    it('should update the user password', async () => {
      const emailParam: EmailParamDto = { email: 'test@example.com' }
      const updatePasswordDto: UpdatePasswordDto = { password: 'newPassword' }
      const updatedUser = {
        email: 'test@example.com',
        password: 'hashedNewPassword'
      }

      jest.spyOn(userService, 'updatePassword').mockResolvedValue(updatedUser)

      const result = await userController.updatePass(
        emailParam,
        updatePasswordDto
      )

      expect(result).toEqual({
        email: 'test@example.com',
        password: 'hashedNewPassword'
      })
    })
  })

  describe('remove', () => {
    it('should delete a user by email', async () => {
      const emailParam: EmailParamDto = { email: 'test@example.com' }
      const deletedUser = { email: 'test@example.com', deleted: true }

      jest.spyOn(userService, 'remove').mockResolvedValue(deletedUser)

      const result = await userController.remove(emailParam)

      expect(result).toEqual({ email: 'test@example.com', deleted: true })
    })
  })

  describe('deletePokemon', () => {
    it('should delete a pokemon from a user', async () => {
      const deletePokemonParam: DeletePokemonParamDto = {
        email: 'test@example.com',
        name: 'pikachu'
      }
      const updatedUser = {
        email: 'test@example.com',
        pokemons: ['charmander']
      }

      jest.spyOn(userService, 'deletePokemon').mockResolvedValue(updatedUser)

      const result = await userController.deletePokemon(deletePokemonParam)

      expect(result).toEqual({
        email: 'test@example.com',
        pokemons: ['charmander']
      })
    })
  })
})
