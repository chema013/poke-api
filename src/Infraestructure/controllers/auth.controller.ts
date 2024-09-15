import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'

import { AuthService } from '../../UsesCases/auth.service'
import { JwtAuthGuard } from '../adapterAuth/guards/jwt-auth.guard'
import { Logger } from '../../UsesCases/logger.service'
import { LoginDto } from '../../Entities/auth/dto/login.dto'
import {
  AuthResponseDto,
  ErrorLoginResponseDto
} from '../../Entities/auth/dto/login.responses.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger
  ) {}

  @ApiOperation({ summary: 'Login del api, genera un token y access token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'El Pokémon fue encontrado.',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'El Pokémon no fue encontrado.',
    type: ErrorLoginResponseDto
  })
  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password
      )

      return this.authService.login(user)
    } catch (error) {
      this.logger.error(error)
      throw new ForbiddenException('Usuario o contraseña incorrectos')
    }
  }

  @ApiOperation({ summary: 'Endpoint para refrescar token' })
  @ApiResponse({
    status: 200,
    description: 'Token JWT actualizado con éxito'
  })
  @ApiResponse({
    status: 401,
    description: 'Autenticación fallida. Token no válido o expirado.'
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@Req() req) {
    return this.authService.refreshToken(req.user)
  }
}
