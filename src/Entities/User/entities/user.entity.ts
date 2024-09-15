import { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Location, LocationSchema } from './location.entity'
import {
  Pokemon,
  PokemonSchema
} from '../../../Entities/pokemon/entities/pokemon.entity'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop()
  id: number

  @Prop()
  name: string

  @Prop()
  age: number

  @Prop()
  email: string

  @Prop()
  lastname: string

  @Prop()
  username: string

  @Prop()
  password: string

  @Prop()
  refreshToken?: string

  @Prop()
  profile: string

  @Prop({ type: LocationSchema })
  location?: Location

  @Prop({ type: [PokemonSchema], default: [] })
  pokemons: Pokemon[]
}

export const UserSchema = SchemaFactory.createForClass(User)
