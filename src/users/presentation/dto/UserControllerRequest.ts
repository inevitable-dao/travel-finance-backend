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

export class UserControllerCreateJourneyRequestBody {
  @ApiProperty({
    example: '2023-10-01T00:00:00Z',
    description: '여행 시작 날짜',
    required: true,
  })
  startDatetime: string;

  @ApiProperty({
    example: '2023-10-02T00:00:00Z',
    description: '여행 종료 날짜',
    required: true,
  })
  endDatetime: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: '카드 아이디 배열',
    required: true,
  })
  cardsId: number[];
}
