import { UserRepository } from '../UserRepository';
import { User } from '../../domain/User';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/UserEntity';
import { Repository } from 'typeorm';
import { MysqlUserRepositoryMapper } from './mapper/MysqlUserRepositoryMapper';
import { UserCard } from '../../domain/UserCard';
import { UserCardPackage } from '../../domain/UserCardPackage';
import { UserCardPackageEntity } from '../entities/UserCardPackageEntity';
import { UserCardEntity } from '../entities/UserCardEntity';

export class MysqlUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserCardPackageEntity)
    private readonly userCardPackageRepository: Repository<UserCardPackageEntity>,
    @InjectRepository(UserCardEntity)
    private readonly userCardRepository: Repository<UserCardEntity>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    const entity = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.userCards', 'userCards')
      .where('users.u_username = :username', { username })
      .getOne();

    if (!entity) {
      return null;
    }

    return MysqlUserRepositoryMapper.toDomain(entity);
  }

  async save(user: User): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        u_username: user.username,
        u_password: user.password,
        u_point: user.point,
      })
      .execute();
  }

  async findUser(username: string, password: string): Promise<User | null> {
    const entity = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.userCards', 'userCards')
      .where('u_username = :username', { username })
      .andWhere('u_password = :password', { password })
      .getOne();

    if (!entity) {
      return null;
    }

    return MysqlUserRepositoryMapper.toDomain(entity);
  }

  async usePoint(username: string, pointAmount: number): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ u_point: () => `u_point - ${pointAmount}` })
      .where('u_username = :username', { username })
      .execute();
  }

  async saveCardPackage(cardPackage: UserCardPackage): Promise<void> {
    await this.userCardPackageRepository
      .createQueryBuilder()
      .insert()
      .into(UserCardPackageEntity)
      .values({
        ucp_user_index: cardPackage.user.id,
        ucp_card_package_index: cardPackage.cardPackage.id,
        ucp_register_datetime: cardPackage.registerDatetime,
      })
      .execute();
  }

  async saveCards(cards: UserCard[]): Promise<void> {
    for (const card of cards) {
      await this.userCardRepository
        .createQueryBuilder()
        .insert()
        .into(UserCardEntity)
        .values({
          uc_user_index: card.user.id,
          uc_card_index: card.card.id,
          uc_is_use: card.isUse ? 'Y': 'N',
          uc_register_datetime: card.registerDatetime,
        })
        .execute();
    }
  }

  async getUserCards(username: string): Promise<UserCard[]> {
    const entities = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.userCards', 'userCards')
      .leftJoinAndSelect('userCards.card', 'card')
      .where('u_username = :username', { username })
      .andWhere('uc_is_use = :isUse', { isUse: 'Y' })
      .getOne();

    if (!entities) {
      return [];
    }

    return MysqlUserRepositoryMapper.toUserCardDomain(entities);
  }

  async useCard(username: string, cardId: number): Promise<void> {
    const userEntity = await this.userRepository
      .createQueryBuilder('users')
      .where('u_username = :username', { username })
      .getOne();

    if (!userEntity) {
      return;
    }

    const user = MysqlUserRepositoryMapper.toDomain(userEntity);

    await this.userCardRepository
      .createQueryBuilder()
      .update()
      .set({ uc_is_use: 'N' })
      .where('uc_user_index = :userIndex', { userIndex: user.id })
      .andWhere('uc_card_index = :cardId', { cardId })
      .execute();
  }
}
