import { ApiProperty } from '@nestjs/swagger'

import { IsNumber, IsString } from 'class-validator'

export class CreatePokemonDto {
  @ApiProperty({
    description: 'Nombre del pokemon',
    example: 'bulbasaur'
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Id del pokemon',
    example: 20
  })
  @IsNumber()
  id: number

  @ApiProperty({
    description: 'Tamaño del pokemon',
    example: 10
  })
  @IsNumber()
  weight: number
}

export interface ISavePokemonsDto {
  name: string
  id: number
  weight: number
}
