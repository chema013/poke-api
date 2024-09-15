import { IsNotEmpty, validateSync } from 'class-validator'

import { IsGeoLocation } from '../../../src/common/decorators/IsGeolocation'

class TestGeoLocationDto {
  @IsNotEmpty()
  @IsGeoLocation({ message: 'Invalid geolocation' })
  location: { latitude: number; longitude: number }
}

describe('IsGeoLocation Decorator', () => {
  it('should validate correct geolocation values', () => {
    const dto = new TestGeoLocationDto()
    dto.location = { latitude: 45, longitude: 90 }

    const errors = validateSync(dto)
    expect(errors.length).toBe(0)
  })

  it('should fail validation for invalid latitude', () => {
    const dto = new TestGeoLocationDto()
    dto.location = { latitude: 100, longitude: 90 }

    const errors = validateSync(dto)
    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isGeoLocation).toBe('Invalid geolocation')
  })

  it('should fail validation for invalid longitude', () => {
    const dto = new TestGeoLocationDto()
    dto.location = { latitude: 45, longitude: 200 }

    const errors = validateSync(dto)
    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isGeoLocation).toBe('Invalid geolocation')
  })

  it('should fail validation if latitude is not a number', () => {
    const dto = new TestGeoLocationDto()
    dto.location = { latitude: 'invalid' as any, longitude: 90 }

    const errors = validateSync(dto)
    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isGeoLocation).toBe('Invalid geolocation')
  })

  it('should fail validation if longitude is not a number', () => {
    const dto = new TestGeoLocationDto()
    dto.location = { latitude: 45, longitude: 'invalid' as any }

    const errors = validateSync(dto)
    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isGeoLocation).toBe('Invalid geolocation')
  })

  it('should return the default message for invalid geolocation values', () => {
    const dto = new TestGeoLocationDto()
    dto.location = { latitude: -100, longitude: 200 }

    const errors = validateSync(dto)
    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isGeoLocation).toBe('Invalid geolocation')
  })
})
