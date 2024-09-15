import { ApiProperty } from '@nestjs/swagger'

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'Id del usuario',
    example: 1
  })
  id: number

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Chema'
  })
  name: string

  @ApiProperty({
    description: 'Edad del usuario',
    example: 28
  })
  age: number

  @ApiProperty({
    description: 'Email del usuario',
    example: 'chema_0131@hotmail.com'
  })
  email: string

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Estrada'
  })
  lastname: string

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'Chema013'
  })
  username: string

  @ApiProperty({
    description: 'Perfil del usuario',
    example: 'user'
  })
  profile: string

  @ApiProperty({
    description: 'Lista de Pokémon asociados',
    type: [String],
    example: []
  })
  pokemons: any[]
}

export class ConflictCreateUserResponseDto {
  @ApiProperty({
    description: 'Mensaje de error',
    example: 'El email ya ha sido registrado'
  })
  message: string

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Conflict'
  })
  error: string

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 409
  })
  statusCode: number
}

/* Respuesta de obtener los usuarios */
export class UserDto {
  @ApiProperty({
    description: 'Id del usuario',
    example: 1
  })
  id: number

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Admin'
  })
  name: string

  @ApiProperty({
    description: 'Edad del usuario',
    example: 0
  })
  age: number

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'admin@example.com'
  })
  email: string

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Admin'
  })
  lastname: string

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'AdminUser'
  })
  username: string

  @ApiProperty({
    description: 'Perfil del usuario',
    example: 'admin'
  })
  profile: string

  @ApiProperty({
    description: 'Geolocalizacion del usuario',
    example: {
      latitude: 40.7128,
      longitude: -74.006
    },
    required: false
  })
  location?: string
}

export class PaginatedUsersResponseDto {
  @ApiProperty({
    description: 'Página actual de la paginación',
    example: 1
  })
  currentPage: number

  @ApiProperty({
    description: 'Número total de páginas',
    example: 1
  })
  totalPages: number

  @ApiProperty({
    description: 'Lista de usuarios paginados',
    type: [UserDto],
    example: [
      {
        name: 'Admin',
        age: 0,
        email: 'admin@example.com',
        lastname: 'Admin',
        username: 'AdminUser',
        profile: 'admin',
        location: {
          latitude: 40.7128,
          longitude: -74.006
        }
      }
    ]
  })
  data: UserDto[]
}

/* Eliminar usuario */

export class DeleteUserResponseDto {
  @ApiProperty({
    description: 'Mensaje indicando que el usuario fue eliminado',
    example: 'Usuario con el email: maru@hotmail.com fue eliminado'
  })
  message: string
}

/* Agregar pokemons */

export class NoMoreMaxPokemonsResponseDto {
  @ApiProperty({
    description: 'Mensaje de error detallado',
    example:
      'No puedes tener más de 6 pokemons ya tienes: 3 y quieres guardar: 4. Elimina: 1 pokemons.'
  })
  message: string

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request'
  })
  error: string

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400
  })
  statusCode: number
}

export class PokemonNotExistResponseDto {
  @ApiProperty({
    description: 'Mensaje de error detallado',
    example: 'Los siguientes pokemons no existen en pokeApi: some'
  })
  message: string

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request'
  })
  error: string

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400
  })
  statusCode: number
}

export class MaxPokemonResponseDto {
  @ApiProperty({
    description: 'Mensaje de error detallado',
    example: 'Ya tienes el número máximo de pokemons.'
  })
  message: string

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request'
  })
  error: string

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400
  })
  statusCode: number
}

export class MinPokemonResponseDto {
  @ApiProperty({
    description: 'Mensaje de error detallado',
    example: 'Se necesita tener al menos 3 pokemons'
  })
  message: string

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request'
  })
  error: string

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400
  })
  statusCode: number
}
