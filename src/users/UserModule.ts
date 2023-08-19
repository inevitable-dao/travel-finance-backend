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
import { CreateJourneyUseCase } from './application/CreateJourneyUseCase/CreateJourneyUseCase';
import { JOURNEY_REPOSITORY } from './infrastructure/JourneyRepository';
import { MysqlJourneyRepository } from './infrastructure/mysql/MysqlJourneyRepository';
import { JourneyEntity } from './infrastructure/entities/JourneyEntity';
import { CARD_REPOSITORY } from '../cards/infrastructure/CardRepository';
import { MysqlCardRepository } from '../cards/infrastructure/mysql/MysqlCardRepository';
import { GetUserJourneysUseCase } from './application/GetUserJourneysUseCase/GetUserJourneysUseCase';
import { CardEntity } from '../cards/infrastructure/entities/CardEntity';
import { GetUserInformationUseCase } from './application/GetUserInformationUseCase/GetUserInformationUseCase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserCardEntity,
      UserCardPackageEntity,
      JourneyEntity,
      CardEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserSignUpUseCase,
    UserSignInUseCase,
    GetUserOwnedCardsUseCase,
    GetUserJourneysUseCase,
    CreateJourneyUseCase,
    GetUserInformationUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
    {
      provide: JOURNEY_REPOSITORY,
      useClass: MysqlJourneyRepository,
    },
  ],
})
export class UserModule {}
