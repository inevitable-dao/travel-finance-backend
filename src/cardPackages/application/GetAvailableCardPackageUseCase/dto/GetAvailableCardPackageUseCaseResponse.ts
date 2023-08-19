import { CoreResponse } from '../../../../shared/core/application/CoreResponse';
import { CardPackage } from '../../../domain/CardPackage';

export interface GetAvailableCardPackageUseCaseResponse extends CoreResponse {
  cardPackage: CardPackage | null;
}
