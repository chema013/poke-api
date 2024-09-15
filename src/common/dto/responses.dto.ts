import { ApiProperty } from '@nestjs/swagger'

export class UnauthorizedResponseDto {
  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Unauthorized'
  })
  message: string

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 401
  })
  statusCode: number
}
