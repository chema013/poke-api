import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'admin@example.com'
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'admin123'
  })
  @IsString({ message: 'El password debe ser un string' })
  password: string
}
