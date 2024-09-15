import { ApiProperty } from '@nestjs/swagger'

export class ErrorNotFoundPokemonDto {
  @ApiProperty({
    description: 'Mensaje de error detallado',
    example: 'Pokemon no encontrado: Pikachu'
  })
  message: string

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Not Found'
  })
  error: string

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 404
  })
  statusCode: number
}

export class PokemonDataDto {
  @ApiProperty({
    description: 'Nombre del Pokémon',
    example: 'bulbasaur'
  })
  name: string

  @ApiProperty({
    description: 'URL de la API del Pokémon',
    example: 'https://pokeapi.co/api/v2/pokemon/1/'
  })
  url: string
}

export class PaginatedResponseDto {
  @ApiProperty({
    description: 'Número de la página actual',
    example: 1
  })
  currentPage: number

  @ApiProperty({
    description: 'Número total de páginas',
    example: 119
  })
  totalPages: number

  @ApiProperty({
    description: 'Lista de Pokémon en la página actual',
    type: [PokemonDataDto]
  })
  data: PokemonDataDto[]
}
