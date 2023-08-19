import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CardPackageRepository } from '../CardPackageRepository';
import { CardPackageEntity } from '../entities/CardPackageEntity';
import { CardPackage } from '../../domain/CardPackage';
import { MysqlCardPackageRepositoryMapper } from './mapper/MysqlCardPackageRepositoryMapper';

export class MysqlCardPackageRepository implements CardPackageRepository {
  constructor(
    @InjectRepository(CardPackageEntity)
    private readonly cardPackageRepository: Repository<CardPackageEntity>,
  ) {}

  async findOne(): Promise<CardPackage | null> {
    const entity = await this.cardPackageRepository
      .createQueryBuilder()
      .where('1=1')
      .getOne();

    if (!entity) {
      return null;
    }

    return MysqlCardPackageRepositoryMapper.toDomain(entity);
  }
}
