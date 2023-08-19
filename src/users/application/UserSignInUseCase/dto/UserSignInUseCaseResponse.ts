import { CoreResponse } from '../../../../shared/core/application/CoreResponse';

export interface UserSignInUseCaseResponse extends CoreResponse {
  token: string;
}
