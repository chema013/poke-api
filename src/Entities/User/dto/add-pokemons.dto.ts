import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested
} from 'class-validator'

import {
  CreatePokemonDto,
  ISavePokemonsDto
} from '../../../Entities/pokemon/dto/createPokemon.dto'

export class AddPokemonsDto {
  @ApiProperty({
    description: 'Arreglo de pokemons',
    type: [CreatePokemonDto],
    example: [
      {
        name: 'venusaur',
        id: 35,
        weight: 75
      },
      {
        name: 'ivysaur',
        id: 35,
        weight: 75
      },
      {
        name: 'bulbasaur',
        id: 35,
        weight: 75
      }
    ]
  })
  @IsArray()
  @ArrayMinSize(1, {
    message: 'El arreglo de pokemons debe tener al menos 1 elemento.'
  })
  @ArrayMaxSize(6, {
    message: 'El arreglo de pokemons no puede tener más de 6 elementos.'
  })
  @ValidateNested({ each: true })
  @Type(() => CreatePokemonDto)
  pokemons: CreatePokemonDto[]
}

export interface IAddPokemons {
  pokemons: ISavePokemonsDto[]
}
