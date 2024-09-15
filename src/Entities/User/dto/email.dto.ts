import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class EmailParamDto {
  @ApiProperty({
    description: 'Email del usuario que se a buscar',
    example: 'chema_013@hotmail.com'
  })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string
}
