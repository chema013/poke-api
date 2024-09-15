import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'

import { AdminUserService } from './UsesCases/adminUser.service'
import { AuthController } from './Infraestructure/controllers/auth.controller'
import { AuthRepository } from './Infraestructure/adapterAuth/authRepository'
import { AuthService } from './UsesCases/auth.service'
import { IAuthRepository } from './UsesCases/Interfaces/IAuthRepository'
import { IPokemonRepository } from './UsesCases/Interfaces/IPokemonRepository'
import { IUserRepository } from './UsesCases/Interfaces/IUserRepository'
import { JwtStrategy } from './Infraestructure/adapterAuth/strategies/jwt.strategy'
import { Logger } from './UsesCases/logger.service'
import { MONGO } from './common/constants'
import { PokemonController } from './Infraestructure/controllers/pokemon.controller'
import { PokemonRepository } from './Infraestructure/adapterPokemon/pokemonRepository'
import { PokemonService } from './UsesCases/pokemon.service'
import { RefreshStrategy } from './Infraestructure/adapterAuth/strategies/refresh.strategy'
import { UserController } from './Infraestructure/controllers/user.controller'
import { UserRepository } from './Infraestructure/adapterUser/userRepository'
import { UserService } from './UsesCases/user.service'
import { User, UserSchema } from './Entities/User/entities/user.entity'

@Module({
  imports: [
    MongooseModule.forRoot(MONGO.URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [UserController, AuthController, PokemonController],
  providers: [
    JwtStrategy,
    RefreshStrategy,
    UserService,
    AuthService,
    AdminUserService,
    PokemonService,
    Logger,
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IAuthRepository, useClass: AuthRepository },
    { provide: IPokemonRepository, useClass: PokemonRepository }
  ]
})
export class AppModule {}
