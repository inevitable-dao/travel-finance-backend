import { UserEntity } from '../../entities/UserEntity';
import { User } from '../../../domain/User';
import { UserCard } from '../../../domain/UserCard';
import { MysqlCardRepositoryMapper } from '../../../../cards/infrastructure/mysql/mapper/MysqlCardRepositoryMapper';
import * as dayjs from 'dayjs';

export class MysqlUserRepositoryMapper {
  static toDomain(entity: UserEntity): User {
    return User.create(
      {
        username: entity.u_username,
        password: '',
        point: entity.u_point,
      },
      entity.u_index,
    ).value;
  }

  static toUserCardDomain(entity: UserEntity): UserCard[] {
    return entity.userCards.map((userCard) => {
      return UserCard.create(
        {
          user: this.toDomain(entity),
          card: MysqlCardRepositoryMapper.toDomain(userCard.card),
          isUse: userCard.uc_is_use === 'Y',
          registerDatetime: dayjs(new Date(userCard.uc_register_datetime)).format('YYYY-MM-DD HH:mm:ss'),
        },
        userCard.uc_index,
      ).value;
    });
  }
}
