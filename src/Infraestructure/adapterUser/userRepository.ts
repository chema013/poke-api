import * as bcrypt from 'bcryptjs'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'

import { ISavePokemonsDto } from '../../Entities/pokemon/dto/createPokemon.dto'
import { IUpdatePasswordDto } from '../../Entities/User/dto/update-password.dto'
import { IUserRepository } from '../../UsesCases/Interfaces/IUserRepository'
import { Logger } from '../../UsesCases/logger.service'
import { User } from '../../Entities/User/entities/user.entity'
import {
  CreateUserDto,
  ICreateUserDto
} from '../../Entities/User/dto/create-user.dto'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly logger: Logger
  ) {}

  async create(createUserDto: ICreateUserDto) {
    const alreadyEmail = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec()
    if (alreadyEmail) {
      throw new ConflictException('El email ya ha sido registrado')
    }

    const hashedPassword = await this.hashPassword(createUserDto.password)

    const newUser: User = {
      ...createUserDto,
      id: Date.now(),
      password: hashedPassword,
      pokemons: [],
      location: { latitude: null, longitude: null }
    }
    const createdUser = new this.userModel(newUser)
    const user = await createdUser.save()

    return {
      id: user.id,
      name: user.name,
      age: user.age,
      email: user.email,
      lastname: user.lastname,
      username: user.username,
      profile: user.profile,
      pokemons: user.pokemons
    }
  }

  async findAll(page: number, pageSize: number = 11) {
    const skip = (page - 1) * pageSize

    const users = await this.userModel
      .find()
      .skip(skip)
      .limit(pageSize)
      .select('-password -__v -_id -pokemons -location._id -refreshToken')
      .exec()
    const totalUsers = await this.userModel.countDocuments()

    return {
      currentPage: page,
      totalPages: Math.ceil(totalUsers / pageSize),
      data: users
    }
  }

  findOne(email: string, includePassword: boolean = false) {
    const projection = {
      __v: 0,
      _id: 0,
      refreshToken: 0,
      'pokemons._id': 0,
      'location._id': 0
    }

    if (!includePassword) {
      // eslint-disable-next-line dot-notation
      projection['password'] = 0
    }

    return this.userModel
      .aggregate([
        { $match: { email } },
        {
          $project: projection
        }
      ])
      .exec()
  }

  async update(email: string, updateUserDto: Partial<CreateUserDto>) {
    const user = await this.findOne(email)
    if (user.length <= 0) {
      throw new NotFoundException('El usuario no existe')
    }

    const alredyEmail = await this.findUsersByEmailIgnoringAnother(
      updateUserDto.email,
      email
    )

    if (alredyEmail.length > 0) {
      throw new ConflictException('Email ya registrado')
    }

    try {
      return await this.userModel
        .findOneAndUpdate({ email }, { $set: updateUserDto }, { new: true })
        .select('-password -__v -_id -pokemons -location._id -refreshToken')
        .exec()
    } catch (error) {
      this.logger.error(error)
      throw new ConflictException('No se pudo actualizar el usuario')
    }
  }

  async deleteUserByEmail(email: string): Promise<object> {
    const user = await this.userModel.findOneAndDelete({ email }).exec()
    if (!user) {
      throw new NotFoundException(`Usuario con el email ${email} no encontrado`)
    }
    return { message: `Usuario con el email: ${email} fue eliminado` }
  }

  async updatePassword(email: string, updatePasswordDto: IUpdatePasswordDto) {
    try {
      const hashedPassword = await this.hashPassword(updatePasswordDto.password)

      return await this.userModel
        .findOneAndUpdate(
          { email },
          { $set: { password: hashedPassword } },
          { new: true }
        )
        .select('-password -__v -_id -pokemons -location._id -refreshToken')
        .exec()
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException(
        'No se pudo actualizar la contraseña'
      )
    }
  }

  async saveLocation(location: object, email: string) {
    const user = await this.findOne(email)
    if (user.length <= 0) {
      throw new NotFoundException('El usuario no existe')
    }

    return this.userModel
      .findOneAndUpdate({ email }, { $set: location }, { new: true })
      .select('-password -__v -_id -pokemons -location._id -refreshToken')
      .exec()
  }

  async addPokemons(pokemons: ISavePokemonsDto[], email: string): Promise<any> {
    const user = await this.findOne(email)
    if (user.length <= 0) {
      throw new NotFoundException('El usuario no existe')
    }

    return this.userModel
      .findOneAndUpdate(
        { email },
        { $push: { pokemons: { $each: pokemons } } },
        { new: true }
      )
      .select('-password -__v -_id -location._id -pokemons._id -refreshToken')
      .exec()
  }

  async getNumberOfPokemons(email: string): Promise<number> {
    const user = await this.findOne(email)
    if (user.length <= 0) {
      throw new NotFoundException('El usuario no existe')
    }

    return user[0].pokemons.length
  }

  async deletePokemon(email: string, name: string) {
    const user = await this.findOne(email)
    if (user.length <= 0) {
      throw new NotFoundException('El usuario no existe')
    }

    return this.userModel
      .findOneAndUpdate(
        { email },
        { $pull: { pokemons: { name } } },
        { new: true }
      )
      .select('-password -__v -_id -pokemons._id -location._id -refreshToken')
      .exec()
  }

  /* Funciones auxiliares */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  }

  findUsersByEmailIgnoringAnother(searchEmail: string, ignoreEmail: string) {
    if (searchEmail === ignoreEmail) {
      return []
    }

    return this.userModel
      .find({
        email: searchEmail,
        $expr: { $ne: [searchEmail, ignoreEmail] }
      })
      .select('-password -__v -_id -pokemons -location._id')
      .exec()
  }

  validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}
