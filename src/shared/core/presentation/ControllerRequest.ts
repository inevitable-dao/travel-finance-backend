import { ApiProperty } from '@nestjs/swagger';
import { AUTH_HEADER } from '../../../auth/domain/JwtStrategy';

export class ControllerRequestAuthCommonHeader {
  @ApiProperty({
    description: 'Authorization header(Swagger does not support)',
    type: String,
    name: AUTH_HEADER,
  })
  authorization: string;
}
