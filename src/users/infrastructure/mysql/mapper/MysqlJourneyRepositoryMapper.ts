import * as dayjs from 'dayjs';
import { JourneyEntity } from '../../entities/JourneyEntity';
import { Journey } from '../../../domain/Journey';
import { MysqlUserRepositoryMapper } from './MysqlUserRepositoryMapper';
import { CardEntity } from '../../../../cards/infrastructure/entities/CardEntity';
import { MysqlCardRepositoryMapper } from '../../../../cards/infrastructure/mysql/mapper/MysqlCardRepositoryMapper';

export class MysqlJourneyRepositoryMapper {
  static toDomain(entity: JourneyEntity, cardEntities: CardEntity[]): Journey {
    const cardIds = entity.j_user_card_indexes.split(',').map((cardIndex) => Number(cardIndex));
    const cards = cardEntities.filter((cardEntity) => cardIds.includes(cardEntity.c_index)).map((cardEntity) => MysqlCardRepositoryMapper.toDomain(cardEntity));

    return Journey.create(
      {
        user: MysqlUserRepositoryMapper.toDomain(entity.user),
        startDatetime: dayjs(new Date(entity.j_start_datetime)).format('YYYY-MM-DDTHH:mm:ss[Z]'),
        endDatetime: dayjs(new Date(entity.j_end_datetime)).format('YYYY-MM-DDTHH:mm:ss[Z]'),
        cards: cards,
      },
      entity.j_index,
    ).value;
  }

  static toDomains(entities: JourneyEntity[], cardEntities: CardEntity[]): Journey[] {
    return entities.map((entity) => this.toDomain(entity, cardEntities));
  }
}
