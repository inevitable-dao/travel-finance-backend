import { ApiProperty } from '@nestjs/swagger';

export class CardControllerUpgradeRequestBody {
  @ApiProperty({
    description: '강화할 카드의 ID',
    example: 1,
    required: true,
  })
  targetCardId: number;

  @ApiProperty({
    description: '강화에 사용할 카드들의 ID (최대 2개)',
    example: [2, 3],
    isArray: true,
    required: true,
  })
  sourceCardsId: number[];
}
