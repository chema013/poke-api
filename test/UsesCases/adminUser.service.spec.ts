import * as bcrypt from 'bcrypt'
import { getModelToken } from '@nestjs/mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Model } from 'mongoose'
import { Test, TestingModule } from '@nestjs/testing'

import { AdminUserService } from '../../src/UsesCases/adminUser.service'
import { Logger } from '../../src/UsesCases/logger.service'
import { UserDocument } from '../../src/Entities/User/entities/location.entity'
import { User, UserSchema } from '../../src/Entities/User/entities/user.entity'

describe('AdminUserService', () => {
  let service: AdminUserService
  let userModel: Model<UserDocument>
  let logger: Logger
  let mongod: MongoMemoryServer

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()

    await mongoose.connect(uri)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUserService,
        Logger,
        {
          provide: getModelToken(User.name),
          useValue: mongoose.model(User.name, UserSchema)
        }
      ]
    }).compile()

    service = module.get<AdminUserService>(AdminUserService)
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name))
    logger = module.get<Logger>(Logger)
  })

  afterEach(async () => {
    await userModel.deleteMany({})
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongod.stop()
  })

  describe('createAdminUser', () => {
    it('should create a new admin user if one does not exist', async () => {
      const adminEmail = 'test@test.com'
      const adminPassword = 'pass'
      const hashedPassword = 'hashedPassword'

      jest.spyOn(userModel, 'findOne').mockResolvedValue(null)
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword)
      jest.spyOn(userModel.prototype, 'save').mockResolvedValue({} as any)
      jest.spyOn(logger, 'log')

      await service['createAdminUser']() // eslint-disable-line dot-notation

      expect(userModel.findOne).toHaveBeenCalledWith({ email: adminEmail })
      expect(bcrypt.hash).toHaveBeenCalledWith(
        adminPassword,
        expect.any(String)
      )
      expect(userModel.prototype.save).toHaveBeenCalled()
      expect(logger.log).toHaveBeenCalledWith('Usuario administrador creado')
    })

    it('should not create a new admin user if one already exists', async () => {
      const adminEmail = 'test@test.com'

      jest.spyOn(userModel, 'findOne').mockResolvedValue({} as any)
      jest.spyOn(bcrypt, 'hash')
      jest.spyOn(userModel.prototype, 'save')
      jest.spyOn(logger, 'log')

      await service['createAdminUser']() // eslint-disable-line dot-notation

      expect(userModel.findOne).toHaveBeenCalledWith({ email: adminEmail })
    })
  })
})
