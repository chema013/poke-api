import * as _ from 'lodash'
import { getModelToken } from '@nestjs/mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Model } from 'mongoose'
import { Test, TestingModule } from '@nestjs/testing'

import { IUpdatePasswordDto } from 'src/Entities/User/dto/update-password.dto'
import { Logger } from '../../../src/UsesCases/logger.service'
import { UpdateUserDto } from 'src/Entities/User/dto/update-user.dto'
import { UserRepository } from '../../../src/Infraestructure/adapterUser/userRepository'
import {
  User,
  UserSchema
} from '../../../src/Entities/User/entities/user.entity'

describe('UserRepository', () => {
  let userRepository: UserRepository
  let mongod: MongoMemoryServer
  let userModel: Model<User>

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        Logger,
        {
          provide: getModelToken(User.name),
          useValue: mongoose.model(User.name, UserSchema)
        }
      ]
    }).compile()

    userRepository = module.get<UserRepository>(UserRepository)
    mongoose.connect(uri)
    userModel = module.get<Model<User>>(getModelToken(User.name))
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongod.stop()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const globalEmail = 'john@example.com'

  it('Testing create an user successfuly', async () => {
    const createUserDto = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      lastname: 'Doe',
      username: 'johndoe',
      password: 'password',
      profile: 'user'
    }

    const user = await userRepository.create(createUserDto)
    expect(user).toBeDefined()
    expect(user.email).toEqual('john@example.com')
  })

  it('Testing method findAll successfuly', async () => {
    const users = await userRepository.findAll(1, 1)

    expect(users).toBeDefined()
    expect(users.data[0].name).toEqual('John')
  })

  it('Testing method findOne successfuly', async () => {
    const [user] = await userRepository.findOne('john@example.com')

    expect(user).toBeDefined()
    expect(user.email).toEqual('john@example.com')
  })

  it('Testing method findOne successfuly includePassword', async () => {
    const [user] = await userRepository.findOne(globalEmail, true)

    expect(user).toBeDefined()
    expect(typeof user.password).toEqual('string')
  })

  it('Testing method update successfuly', async () => {
    const updateData: UpdateUserDto = { name: 'newName' }

    const user = await userRepository.update(globalEmail, updateData)

    expect(user.name).toEqual('newName')
  })

  it('Testing method update successfuly email already exist', async () => {
    const createOtherUserDto = {
      name: 'John',
      age: 30,
      email: 'johnAlready@example.com',
      lastname: 'Doe',
      username: 'johndoe',
      password: 'password',
      profile: 'user'
    }
    await userRepository.create(createOtherUserDto)
    const updateData: UpdateUserDto = { email: 'johnAlready@example.com' }

    await expect(
      userRepository.update(globalEmail, updateData)
    ).rejects.toThrow('Email ya registrado')
  })

  it('Testing method update successfuly, user does not exists', async () => {
    const updateData: UpdateUserDto = { email: 'johnAlready@example.com' }

    await expect(
      userRepository.update('doesNotExists', updateData)
    ).rejects.toThrow('El usuario no existe')
  })

  it('should throw a ConflictException if there is an error during the update operation', async () => {
    const email = globalEmail
    const updateUserDto = { name: 'Updated Name' }

    const findOneAndUpdateMock = jest
      .spyOn(userModel, 'findOneAndUpdate')
      .mockImplementation(
        () =>
          ({
            select: jest.fn().mockImplementation(() => {
              throw new Error('Database error')
            })
          }) as any
      )

    await expect(userRepository.update(email, updateUserDto)).rejects.toThrow()

    findOneAndUpdateMock.mockRestore()
  })

  it('Testing method updatePassword Successfuly', async () => {
    const updatePass: IUpdatePasswordDto = {
      password: '1234'
    }

    const resp = await userRepository.updatePassword(globalEmail, updatePass)

    expect(typeof resp.email).toEqual('string')
  })

  it('Testing method updatePassword error', async () => {
    const updatePass: IUpdatePasswordDto = {
      password: '1234'
    }
    const findOneAndUpdateMock = jest
      .spyOn(userModel, 'findOneAndUpdate')
      .mockImplementation(
        () =>
          ({
            select: jest.fn().mockImplementation(() => {
              throw new Error('Database error')
            })
          }) as any
      )

    await expect(
      userRepository.updatePassword(globalEmail, updatePass)
    ).rejects.toThrow('No se pudo actualizar la contraseña')

    findOneAndUpdateMock.mockRestore()
  })

  it('Testing method deleteUserByEmail successfuly, user does not exists', async () => {
    await expect(
      userRepository.deleteUserByEmail('doesNotExists')
    ).rejects.toThrow(`Usuario con el email doesNotExists no encontrado`)
  })

  it('Testing method deleteUserByEmail successfuly', async () => {
    const user = new userModel({
      email: 'testDelete@example.com',
      password: 'oldPassword'
    })
    await user.save()

    const response = await userRepository.deleteUserByEmail(
      'testDelete@example.com'
    )

    expect(_.get(response, 'message')).toEqual(
      `Usuario con el email: testDelete@example.com fue eliminado`
    )
  })

  it('Testing method saveLocation successfuly', async () => {
    const response = await userRepository.saveLocation(
      {
        location: {
          latitude: 40.7128,
          longitude: -74.006
        }
      },
      globalEmail
    )

    expect(response.location.latitude).toEqual(40.7128)
  })

  it('Testing method addPokemons successfuly', async () => {
    const response = await userRepository.addPokemons(
      [
        {
          name: 'venusaur',
          id: 35,
          weight: 75
        }
      ],
      globalEmail
    )

    expect(response.pokemons[0].name).toEqual('venusaur')
  })

  it('Testing method addPokemons successfuly user does not exists', async () => {
    await expect(userRepository.addPokemons([], 'wrongEamil')).rejects.toThrow(
      'El usuario no existe'
    )
  })

  it('Testing method getNumberOfPokemons successfuly', async () => {
    const response = await userRepository.getNumberOfPokemons(globalEmail)

    expect(response).toEqual(1)
  })

  it('Testing method deletePokemon successfuly', async () => {
    const response = await userRepository.deletePokemon(globalEmail, 'venusaur')

    expect(response.email).toEqual(globalEmail)
  })

  it('Testing method deletePokemon error', async () => {
    await expect(
      userRepository.deletePokemon('wrongEmail', '')
    ).rejects.toThrow('El usuario no existe')
  })

  it('Testing method validatePassword successfuly', async () => {
    const response = await userRepository.validatePassword('password', 'hashed')

    expect(response).toEqual(false)
  })
})
