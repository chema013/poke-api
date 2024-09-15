import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluVXNlciIsInByb2ZpbGUiOiJhZG1pbiIsImlhdCI6MTcyNjE5OTkxNiwiZXhwIjoxNzI2MjAzNTE2fQ.6bFXUv6jnBqeo4HTzovwDkKexXr8hSNlcJXyyEJzbAw'
  })
  accessToken: string

  @ApiProperty({
    description: 'Token de actualización JWT',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluVXNlciIsInByb2ZpbGUiOiJhZG1pbiIsImlhdCI6MTcyNjE5OTkxNiwiZXhwIjoxNzI2ODA0NzE2fQ.r09P9ZUYDN05RcX1w5wjV7Hs6D5gnobHU_wYKvmbeG4'
  })
  refreshToken: string
}

export class ErrorLoginResponseDto {
  @ApiProperty({
    description: 'Mensaje descriptivo del error',
    example: 'Usuario o contraseña incorrectos'
  })
  message: string

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Forbidden'
  })
  error: string

  @ApiProperty({
    description: 'Código de estado HTTP del error',
    example: 403
  })
  statusCode: number
}
