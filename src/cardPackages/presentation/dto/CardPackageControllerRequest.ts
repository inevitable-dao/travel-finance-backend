import { ApiProperty } from '@nestjs/swagger';

export class CardPackageControllerPurchaseCardPackageRequestParam {
  @ApiProperty({
    description: 'The ID of the card package to purchase',
    example: 1,
    type: Number,
  })
  id: number;
}
