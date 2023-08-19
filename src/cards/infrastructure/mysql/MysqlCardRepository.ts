import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardRepository } from '../CardRepository';
import { CardEntity } from '../entities/CardEntity';
import { Card } from '../../domain/Card';
import { MysqlCardRepositoryMapper } from './mapper/MysqlCardRepositoryMapper';
import { CardRank } from '../../domain/CardRank';
import { CardType } from '../../domain/CardType';

export class MysqlCardRepository implements CardRepository {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {}

  async findAllByPackage(cardPackageId: number): Promise<Card[]> {
    const entities = await this.cardRepository
      .createQueryBuilder()
      .where('c_card_package_indexes = :cardPackageId', { cardPackageId })
      .getMany();

    return MysqlCardRepositoryMapper.toDomains(entities);
  }

  async findAllByRankAndType(rank: CardRank, type: CardType): Promise<Card[]> {
    const entities = await this.cardRepository
      .createQueryBuilder()
      .where('c_rank = :rank', { rank })
      .andWhere('c_type = :type', { type })
      .getMany();

    return MysqlCardRepositoryMapper.toDomains(entities);
  }
}
