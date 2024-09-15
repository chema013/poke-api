import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common'

import { NameParamDto } from '../../Entities/pokemon/dto/name.dto'
import { PaginationDto } from '../../Entities/pokemon/dto/pagination.dto'
import { PokemonService } from '../../UsesCases/pokemon.service'
import {
  ErrorNotFoundPokemonDto,
  PaginatedResponseDto
} from '../../Entities/pokemon/dto/responses.dto'

@ApiTags('pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @ApiOperation({
    summary:
      'Endpoint para obtener todos los pokemons en tramos de 11 elementos',
    description:
      'Este endpoint sirve para buscar pokemons. Viene paginado y trae los pokemos en tramos de 11 elementos, se puede mandar el queryparam page para traer otro bloque'
  })
  @ApiResponse({
    status: 200,
    description: 'Obtener todos los pokemons exitosamente',
    type: PaginatedResponseDto
  })
  @Get()
  findAll(@Query() query: PaginationDto) {
    let { page } = query
    if (!page || page < 1) {
      page = 1
    }

    return this.pokemonService.findAll(page)
  }

  @ApiOperation({
    summary: 'Endpoint para obtener un pokemon por nombre',
    description:
      'Este endpoint permite buscar un Pokémon utilizando su nombre. El nombre del Pokémon se pasa como parámetro en la ruta.'
  })
  @ApiResponse({
    status: 200,
    description: 'Pokémon encontrado exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Pokémon no encontrado',
    type: ErrorNotFoundPokemonDto
  })
  @Get(':name')
  findOne(@Param(new ValidationPipe()) params: NameParamDto) {
    const { name } = params

    return this.pokemonService.findOne(name)
  }
}
