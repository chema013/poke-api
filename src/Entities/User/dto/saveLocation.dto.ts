import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

import { IsGeoLocation } from '../../../common/decorators/IsGeolocation'

export class LocationDto {
  @ApiProperty({
    description: 'Latitud de la geolocalizacion',
    example: 40.7128
  })
  @IsNumber()
  latitude: number

  @ApiProperty({
    description: 'Longitud de la geolocalizacion',
    example: -74.006
  })
  @IsNumber()
  longitude: number
}

export class SaveLocationDto {
  @ApiProperty({
    description: 'Geolocalizacion del usuario',
    type: LocationDto
  })
  @IsGeoLocation({
    message: 'La localización debe ser válida y dentro de los rangos permitidos'
  })
  location: LocationDto
}
