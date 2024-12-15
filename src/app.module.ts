import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './modules/auth/auth.module'
import { TaskModule } from './modules/task'
import { ProjectModule } from './modules/project'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
        MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
        MONGO_INITDB_DATABASE: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        MONGO_PORT: Joi.string().required(),
        JWT_SECRET: Joi.string().required()
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get<string>(
          'MONGO_INITDB_ROOT_USERNAME'
        )
        const password = configService.get<string>(
          'MONGO_INITDB_ROOT_PASSWORD'
        )
        const database = configService.get<string>('MONGO_INITDB_DATABASE')
        const host = configService.get<string>('MONGO_HOST')
        const port = configService.get<string>('MONGO_PORT')

        return {
          uri: `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`
        }
      },
      inject: [ConfigService]
    }),
    AuthModule,
    TaskModule,
    ProjectModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
