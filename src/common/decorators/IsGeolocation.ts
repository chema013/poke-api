import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator'

export function IsGeoLocation(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGeoLocation',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          if (
            typeof value.latitude !== 'number' ||
            typeof value.longitude !== 'number'
          ) {
            return false
          }

          const { latitude, longitude } = value
          return (
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
          )
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(args: ValidationArguments) {
          return 'La localización debe tener una latitud entre -90 y 90 y una longitud entre -180 y 180'
        }
      }
    })
  }
}
