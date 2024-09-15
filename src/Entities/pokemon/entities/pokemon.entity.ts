import { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { User } from '../../User/entities/user.entity'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class Pokemon {
  @Prop({ type: String })
  name: string

  @Prop({ type: Number })
  id: number

  @Prop({ type: Number })
  weight: number
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon)
