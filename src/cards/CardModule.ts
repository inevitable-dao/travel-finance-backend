import { Module } from '@nestjs/common';
import { CardController } from './presentation/CardController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from './infrastructure/entities/CardEntity';
import { CARD_REPOSITORY } from './infrastructure/CardRepository';
import { MysqlCardRepository } from './infrastructure/mysql/MysqlCardRepository';
import { UpgradeCardUseCase } from './application/UpgradeCardUseCase/UpgradeCardUseCase';
import { UserEntity } from '../users/infrastructure/entities/UserEntity';
import { USER_REPOSITORY } from '../users/infrastructure/UserRepository';
import { MysqlUserRepository } from '../users/infrastructure/mysql/MysqlUserRepository';
import { UserCardPackageEntity } from '../users/infrastructure/entities/UserCardPackageEntity';
import { UserCardEntity } from '../users/infrastructure/entities/UserCardEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CardEntity,
      UserEntity,
      UserCardPackageEntity,
      UserCardEntity,
    ]),
  ],
  controllers: [CardController],
  providers: [
    UpgradeCardUseCase,
    {
      provide: CARD_REPOSITORY,
      useClass: MysqlCardRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
  ],
})
export class CardModule {}
