import { CoreResponse } from '../../../../shared/core/application/CoreResponse';
import { Card } from '../../../domain/Card';

export interface UpgradeCardUseCaseResponse extends CoreResponse {
  card: Card;
}
