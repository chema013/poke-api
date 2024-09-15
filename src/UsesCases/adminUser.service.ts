import * as bcrypt from 'bcrypt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Injectable, OnModuleInit } from '@nestjs/common'

import { Logger } from './logger.service'
import { MONGO } from '../common/constants'
import { UserProfileEnum } from '../Entities/User/enums/profile'
import { User, UserDocument } from '../Entities/User/entities/user.entity'

@Injectable()
export class AdminUserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly logger: Logger
  ) {}

  async onModuleInit() {
    await this.createAdminUser()
  }

  private async createAdminUser() {
    const { ADMIN_EMAIL: adminEmail, ADMIN_PASSWORD: adminPassword } = MONGO

    const adminUser = await this.userModel.findOne({ email: adminEmail })

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(adminPassword, salt)

      const newAdmin = new this.userModel({
        email: adminEmail,
        password: hashedPassword,
        profile: UserProfileEnum.ADMIN,
        name: 'Admin',
        age: 0,
        lastname: 'Admin',
        username: 'AdminUser'
      })

      await newAdmin.save()
      this.logger.log('Usuario administrador creado')
    } else {
      this.logger.log('El usuario administrador ya existe')
    }
  }
}
