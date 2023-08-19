import { ApiProperty } from '@nestjs/swagger';

export class UserControllerSignUpRequestBody {
  @ApiProperty({
    example: 'iam@juneyoung.io',
    description: '이메일',
    required: true,
  })
  username: string;

  @ApiProperty({
    example: 'password',
    description: '비밀번호',
    required: true,
  })
  password: string;
}

export class UserControllerSignInRequestBody {
  @ApiProperty({
    example: 'iam@juneyoung.io',
    description: '이메일',
    required: true,
  })
  username: string;

  @ApiProperty({
    example: 'password',
    description: '비밀번호',
    required: true,
  })
  password: string;
}
