import { JourneyRepository } from '../JourneyRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { JourneyEntity } from '../entities/JourneyEntity';
import { Repository } from 'typeorm';
import { Journey } from '../../domain/Journey';
import { CardEntity } from '../../../cards/infrastructure/entities/CardEntity';
import { MysqlJourneyRepositoryMapper } from './mapper/MysqlJourneyRepositoryMapper';

export class MysqlJourneyRepository implements JourneyRepository {
  constructor(
    @InjectRepository(JourneyEntity)
    private readonly journeyRepository: Repository<JourneyEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {}

  async findAll(userIndex: number): Promise<Journey[]> {
    const entities = await this.journeyRepository
      .createQueryBuilder('journeys')
      .innerJoinAndSelect('journeys.user', 'users')
      .where('journeys.j_user_index = :userIndex', { userIndex })
      .orderBy('journeys.j_start_datetime', 'DESC')
      .getMany();

    const cardEntities = await this.cardRepository
      .createQueryBuilder()
      .where('c_index IN (:...cardIndexes)', { cardIndexes: entities.map((entity) => entity.j_user_card_indexes.split(',')).flat() })
      .getMany();

    return MysqlJourneyRepositoryMapper.toDomains(entities, cardEntities);
  }

  async save(journey: Journey): Promise<void> {
    await this.journeyRepository
      .createQueryBuilder()
      .insert()
      .into(JourneyEntity)
      .values({
        j_user_index: journey.user.id,
        j_start_datetime: journey.startDatetime,
        j_end_datetime: journey.endDatetime,
        j_user_card_indexes: journey.cards.map((card) => card.id).join(','),
      })
      .execute();
  }
}
