import { CardPackageEntity } from '../../entities/CardPackageEntity';
import { CardPackage } from '../../../domain/CardPackage';

export class MysqlCardPackageRepositoryMapper {
  static toDomain(entity: CardPackageEntity): CardPackage {
    return CardPackage.create(
      {
        name: entity.cp_name,
        originalPrice: entity.cp_original_price,
        price: entity.cp_price,
      },
      entity.cp_index,
    ).value;
  }
}
