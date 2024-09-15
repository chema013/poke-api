import { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { User } from './user.entity'

export type UserDocument = HydratedDocument<User>

@Schema()
export class Location {
  @Prop({ type: Number })
  latitude: number

  @Prop({ type: Number })
  longitude: number
}

export const LocationSchema = SchemaFactory.createForClass(Location)
