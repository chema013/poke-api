import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common'

import { AddPokemonsDto } from '../../Entities/User/dto/add-pokemons.dto'
import { DeletePokemonParamDto } from '../../Entities/User/dto/deletePokemon.dto'
import { EmailParamDto } from '../../Entities/User/dto/email.dto'
import { JwtAuthGuard } from '../adapterAuth/guards/jwt-auth.guard'
import { PaginationDto } from '../../Entities/pokemon/dto/pagination.dto'
import { Profiles } from '../../common/decorators/profiles'
import { ProfilesGuard } from '../adapterAuth/guards/profiles.guard'
import { SaveLocationDto } from '../../Entities/User/dto/saveLocation.dto'
import { UnauthorizedResponseDto } from '../../common/dto/responses.dto'
import { UpdatePasswordDto } from '../../Entities/User/dto/update-password.dto'
import { UpdateUserDto } from '../../Entities/User/dto/update-user.dto'
import { UserProfileEnum } from '../../Entities/User/enums/profile'
import { UserService } from '../../UsesCases/user.service'
import {
  ConflictCreateUserResponseDto,
  CreateUserResponseDto,
  DeleteUserResponseDto,
  MaxPokemonResponseDto,
  MinPokemonResponseDto,
  NoMoreMaxPokemonsResponseDto,
  PaginatedUsersResponseDto,
  PokemonNotExistResponseDto,
  UserDto
} from '../../Entities/User/dto/responses.dto'
import {
  CreateUserDto,
  UserCompleteDto
} from '../../Entities/User/dto/create-user.dto'

@ApiTags('user')
@UseGuards(JwtAuthGuard, ProfilesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Endpoint para crear un usuario',
    description:
      'Este endpoint sirve para crear un nuevo usuario con el pérfil de Administrador. Este endpoint puede usuarlo el pérfil de administrador'
  })
  @ApiResponse({
    status: 200,
    description: 'Crear un usuario exitosamente',
    type: CreateUserResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Error de no autorización',
    type: UnauthorizedResponseDto
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya ha sido registrado',
    type: ConflictCreateUserResponseDto
  })
  @ApiBearerAuth()
  @Profiles(UserProfileEnum.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @ApiOperation({
    summary: 'Endpoint para agregar geolocalización al usuario',
    description:
      'Este endpoint sirve para asignarle geolocalización al usuario, lo puede hacer el pérfil de usuario y administrador'
  })
  @ApiResponse({
    status: 200,
    description: 'Geolocalización agregada exitosamente',
    type: UserDto
  })
  @ApiResponse({
    status: 401,
    description: 'Error de no autorización',
    type: UnauthorizedResponseDto
  })
  @ApiBearerAuth()
  @Profiles(UserProfileEnum.ADMIN, UserProfileEnum.USER)
  @Patch('save-location/:email')
  saveLocation(
    @Param(new ValidationPipe()) params: EmailParamDto,
    @Body() saveLocationDto: SaveLocationDto
  ) {
    const { email } = params

    return this.userService.saveLocation(saveLocationDto, email)
  }

  @ApiOperation({
    summary: 'Endpoint para agregar pokemons a un usuario',
    description:
      'Este endpoint sirve para asignarle pokemons a un usuario, el pokemon debe existir en el pokeApi y debe de tener entre 3 minimo y 6 como máximo. Este endpoint puede usuarlo el pérfil de administrador y usuario'
  })
  @ApiResponse({
    status: 200,
    description: 'Pokemons agregados exitosamente',
    type: UserCompleteDto
  })
  @ApiResponse({
    status: 401,
    description: 'Error de no autorización',
    type: UnauthorizedResponseDto
  })
  @ApiExtraModels(
    MaxPokemonResponseDto,
    PokemonNotExistResponseDto,
    MinPokemonResponseDto,
    NoMoreMaxPokemonsResponseDto
  )
  @ApiResponse({
    status: 400,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(MaxPokemonResponseDto) },
        { $ref: getSchemaPath(PokemonNotExistResponseDto) },
        { $ref: getSchemaPath(MinPokemonResponseDto) },
        { $ref: getSchemaPath(NoMoreMaxPokemonsResponseDto) }
      ]
    },
    description: 'Errores de validación posibles para el código 400'
  })
  @ApiBearerAuth()
  @Profiles(UserProfileEnum.ADMIN, UserProfileEnum.USER)
  @Patch('save-pokemons/:email')
  savePokemons(
    @Param(new ValidationPipe()) params: EmailParamDto,
    @Body() pokemons: AddPokemonsDto
  ) {
    const { email } = params

    return this.userService.addPokemons(pokemons, email)
  }

  @ApiOperation({
    summary: 'Endpoint para obtener la información de todos los usuarios',
    description:
      'Este endpoint sirve para obtener la información de todos los usuarios en bloques de 11 elementos. Este endpoint puede usuarlo el pérfil de administrador y usuario'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de usuarios',
    type: PaginatedUsersResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Error de no autorización',
    type: UnauthorizedResponseDto
  })
  @ApiBearerAuth()
  @Profiles(UserProfileEnum.ADMIN, UserProfileEnum.USER)
  @Get()
  findAll(@Query() query: PaginationDto) {
    let { page } = query
    if (!page || page < 1) {
      page = 1
    }

    return this.userService.findAll(page)
  }

  @ApiOperation({
    summary: 'Endpoint para obtener la información de un usuario',
    description:
      'Endpoint para obtener la información de un usuario filtrado por email incluyendo sus pokemons y geolocalización. Este endpoint puede usuarlo el pérfil de administrador y usuario'
  })
  @ApiResponse({
    status: 200,
    description: 'Trae un usuario exitosamente',
    type: UserCompleteDto
  })
  @ApiResponse({
    status: 401,
    description: 'Error de no autorización',
    type: UnauthorizedResponseDto
  })
  @ApiBearerAuth()
  @Profiles(UserProfileEnum.ADMIN, UserProfileEnum.USER)
  @Get(':email')
  findOne(@Param(new ValidationPipe()) params: EmailParamDto) {
    const { email } = params

    return this.userService.findOne(email)
  }

  @ApiOperation({
    summary: 'Endpoint para actualizar la información de un usuario',
    description:
      'Endpoint para actualizar la información de un usuario excepto la contraseña y los pokemons. Este endpoint puede usuarlo el pérfil de administrador y usuario'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UserDto
  })
  @ApiResponse({
    status: 401,
    description: 'Error de no autorización',
    type: UnauthorizedResponseDto
  })
  @ApiBearerAuth()
  @Profiles(UserProfileEnum.ADMIN, UserProfileEnum.USER)
  @Patch(':email')
  update(
    @Param(new ValidationPipe()) params: EmailParamDto,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const { email } = params

    return this.userService.update(email, updateUserDto)
  }

  @ApiOperation({
    summary: 'Endpoint para actualizar la contraseña',
    description:
      'Endpoint para actualizar la contraseña de un usuario.E ste endpoint solo puede usarlo el administrador'
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente',
    type: UserDto
  })
  @ApiResponse({
    status: 401,
    description: 'Error de no autorización',
    type: UnauthorizedResponseDto
  })
  @ApiBearerAuth()
  @Profiles(UserProfileEnum.ADMIN)
  @Patch('pass/:email')
  updatePass(
    @Param(new ValidationPipe()) params: EmailParamDto,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    const { email } = params

    return this.userService.updatePassword(email, updatePasswordDto)
  }

  @ApiOperation({
    summary: 'Endpoint para eliminar un usuario',
    description:
      'Endpoint para eliminar un usuario filtrado por email. Este endpoint solo puede usarlo el administrador'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
    type: DeleteUserResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Error de no autorización',
    type: UnauthorizedResponseDto
  })
  @ApiBearerAuth()
  @Profiles(UserProfileEnum.ADMIN)
  @Delete(':email')
  remove(@Param(new ValidationPipe()) params: EmailParamDto) {
    const { email } = params

    return this.userService.remove(email)
  }

  @ApiOperation({
    summary: 'Endpoint para eliminar un pokemon de un usuario',
    description:
      'Endpoint para eliminar un pokemon de un usuario filtrado por email y nombre del pokemon. Este endpoint puede usarlo el pérfil de administrador y usuario'
  })
  @ApiResponse({
    status: 200,
    description: 'Pokemon eliminado exitosamente',
    type: UserCompleteDto
  })
  @ApiResponse({
    status: 401,
    description: 'Error de no autorización',
    type: UnauthorizedResponseDto
  })
  @ApiBearerAuth()
  @Profiles(UserProfileEnum.ADMIN)
  @Delete('pokemon/:email/:name')
  deletePokemon(@Param(new ValidationPipe()) params: DeletePokemonParamDto) {
    const { email, name } = params

    return this.userService.deletePokemon(email, name)
  }
}
