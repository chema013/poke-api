import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

import { LocationDto } from './saveLocation.dto'
import { UserProfileEnum } from '../enums/profile'
import {
  CreatePokemonDto,
  ISavePokemonsDto
} from '../../../Entities/pokemon/dto/createPokemon.dto'

export class CreateUserDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Chema' })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Edad del usuario, debe ser un número',
    example: 28
  })
  @IsNumber()
  age: number

  @ApiProperty({ description: 'Apellido del usuario', example: 'Estrada' })
  @IsString()
  lastname: string

  @ApiProperty({ description: 'Alias del usuario', example: 'Chema013' })
  @IsString()
  username: string

  @ApiProperty({
    description: 'Email del usuario',
    example: 'chema_013@hotmail.com'
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'PasswordExample'
  })
  @IsString()
  password: string

  @ApiHideProperty()
  @ApiProperty({
    description: 'Refresh token del usuario, es opcional',
    example: 'token'
  })
  @IsString()
  @IsOptional()
  refreshToken?: string

  @ApiProperty({
    description: 'Pérfil del usuario',
    enum: UserProfileEnum,
    example: 'user'
  })
  @IsEnum(UserProfileEnum, {
    message: `El perfil debe ser alguno de los siguientes: ${Object.values(UserProfileEnum)}`
  })
  profile: string

  @ApiHideProperty()
  @IsOptional()
  @IsArray()
  pokemons?: ISavePokemonsDto[]

  @ApiHideProperty()
  @IsOptional()
  @IsArray()
  location?: ISavePokemonsDto[]
}
export class UserCompleteDto extends CreateUserDto {
  @ApiProperty({ description: 'Id del usuario', example: 1 })
  id: number

  @ApiProperty({
    description:
      'Lista de Pokémon a guardar. Siempre se crea un array vacio ya que los pokemons se asignan en el endpoint pertinente',
    type: [CreatePokemonDto],
    required: false
  })
  pokemons?: ISavePokemonsDto[]

  @ApiProperty({
    description: 'Geolocalizacion del usuario',
    type: LocationDto,
    required: false
  })
  location?: ISavePokemonsDto[]
}

export interface ICreateUserDto {
  name: string
  age: number
  lastname: string
  username: string
  email: string
  password: string
  profile: string
  refreshToken?: string
  pokemons?: ISavePokemonsDto[]
}
