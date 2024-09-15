import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString } from 'class-validator'

export class NameParamDto {
  @ApiProperty({
    description: 'Nombre del Pokémon para buscar',
    example: 'bulbasaur'
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe tener un formato válido' })
  name: string
}
