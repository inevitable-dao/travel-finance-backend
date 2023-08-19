import { Card } from '../../../../cards/domain/Card';
import { CoreResponse } from '../../../../shared/core/application/CoreResponse';

export interface RevealCardPackageUseCaseResponse extends CoreResponse {
  cards: Card[];
}
