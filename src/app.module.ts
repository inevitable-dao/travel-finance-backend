import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { config } from './config';
import { CardPackageModule } from './cardPackages/CardPackageModule';
import { AuthModule } from './auth/AuthModule';
import { UserModule } from './users/UserModule';
import { CardModule } from './cards/CardModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.MYSQL.HOST,
      port: config.MYSQL.PORT,
      username: config.MYSQL.USER,
      password: config.MYSQL.PASSWORD,
      database: config.MYSQL.DATABASE,
      synchronize: false,
      entities: [
        __dirname + '/**/entities/*Entity{.ts,.js}',
        __dirname + '/**/entities/*View{.ts,.js}',
      ],
      charset: 'utf8mb4',
      logging: [],
    }),
    AuthModule,
    CardPackageModule,
    UserModule,
    CardModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
