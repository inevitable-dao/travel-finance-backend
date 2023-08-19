import { CoreResponse } from '../../../../shared/core/application/CoreResponse';
import { Journey } from '../../../domain/Journey';

export interface GetUserJourneysUseCaseResponse extends CoreResponse {
  journeys: Journey[];
}
