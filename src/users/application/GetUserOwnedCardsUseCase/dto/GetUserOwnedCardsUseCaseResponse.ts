import { CoreResponse } from '../../../../shared/core/application/CoreResponse';
import { Card } from '../../../../cards/domain/Card';

export interface GetUserOwnedCardsUseCaseResponse extends CoreResponse {
  cards: Card[];
}
