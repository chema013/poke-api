import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class DeletePokemonParamDto {
  @ApiProperty({
    description:
      'Email del usuario al que se le desea eliminar pokemons por nombre',
    example: 'chema_013@hotmail.com'
  })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string

  @ApiProperty({
    description:
      'Nombre del pokemon que se desea eliminar, si hay repetidos se eliminaran todos',
    example: 'venusaur'
  })
  @IsNotEmpty({ message: 'El campo nombre no puede estar vacío' })
  @IsString({ message: 'El campo nombre debe ser texto' })
  name: string
}
