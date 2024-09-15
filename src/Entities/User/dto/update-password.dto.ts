import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Nueva contraseña', example: '1234' })
  @IsString()
  password: string
}

export interface IUpdatePasswordDto {
  password: string
}
