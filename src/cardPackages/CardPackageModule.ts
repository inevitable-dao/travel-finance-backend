import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardPackageController } from './presentation/CardPackageController';
import { CardPackageEntity } from './infrastructure/entities/CardPackageEntity';
import { CARD_PACKAGE_REPOSITORY } from './infrastructure/CardPackageRepository';
import { MysqlCardPackageRepository } from './infrastructure/mysql/MysqlCardPackageRepository';
import { GetAvailableCardPackageUseCase } from './application/GetAvailableCardPackageUseCase/GetAvailableCardPackageUseCase';
import { PurchaseCardPackageUseCase } from './application/PurchaseCardPackageUseCase/PurchaseCardPackageUseCase';
import { UserCardPackageEntity } from '../users/infrastructure/entities/UserCardPackageEntity';
import { UserCardEntity } from '../users/infrastructure/entities/UserCardEntity';
import { USER_REPOSITORY } from '../users/infrastructure/UserRepository';
import { MysqlUserRepository } from '../users/infrastructure/mysql/MysqlUserRepository';
import { UserEntity } from '../users/infrastructure/entities/UserEntity';
import { RevealCardPackageUseCase } from './application/RevealCardPackageUseCase/RevealCardPackageUseCase';
import { CARD_REPOSITORY } from '../cards/infrastructure/CardRepository';
import { MysqlCardRepository } from '../cards/infrastructure/mysql/MysqlCardRepository';
import { CardEntity } from '../cards/infrastructure/entities/CardEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CardPackageEntity,
      UserCardPackageEntity,
      UserCardEntity,
      UserEntity,
      CardEntity,
    ]),
  ],
  controllers: [CardPackageController],
  providers: [
    GetAvailableCardPackageUseCase,
    PurchaseCardPackageUseCase,
    RevealCardPackageUseCase,
    {
      provide: CARD_PACKAGE_REPOSITORY,
      useClass: MysqlCardPackageRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
    {
      provide: CARD_REPOSITORY,
      useClass: MysqlCardRepository,
    },
  ],
})
export class CardPackageModule {}
