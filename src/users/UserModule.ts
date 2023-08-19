import { Module } from '@nestjs/common';
import { UserController } from './presentation/UserController';
import { UserSignUpUseCase } from './application/UserSignUpUseCase/UserSignUpUseCase';
import { USER_REPOSITORY } from './infrastructure/UserRepository';
import { MysqlUserRepository } from './infrastructure/mysql/MysqlUserRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/entities/UserEntity';
import { UserSignInUseCase } from './application/UserSignInUseCase/UserSignInUseCase';
import { UserCardEntity } from './infrastructure/entities/UserCardEntity';
import { UserCardPackageEntity } from './infrastructure/entities/UserCardPackageEntity';
import { GetUserOwnedCardsUseCase } from './application/GetUserOwnedCardsUseCase/GetUserOwnedCardsUseCase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserCardEntity,
      UserCardPackageEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserSignUpUseCase,
    UserSignInUseCase,
    GetUserOwnedCardsUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
  ],
})
export class UserModule {}
