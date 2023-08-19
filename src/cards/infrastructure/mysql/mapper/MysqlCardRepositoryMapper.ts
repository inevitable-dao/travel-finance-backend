import { CardEntity } from '../../entities/CardEntity';
import { Card } from '../../../domain/Card';
import { CardType } from '../../../domain/CardType';

export class MysqlCardRepositoryMapper {
  static toDomain(entity: CardEntity): Card {
    return Card.create(
      {
        name: entity.c_name,
        type: entity.c_type as CardType,
        description: entity.c_description,
        address: entity.c_address,
        estimatedHours: entity.c_estimated_hours,
        costValue: entity.c_cost_value,
        rank: entity.c_rank,
      },
      entity.c_index,
    ).value;
  }

  static toDomains(entities: CardEntity[]): Card[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
