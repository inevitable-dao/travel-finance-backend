import { Request, Response } from 'express';
import { Body, Controller, Headers, ForbiddenException, HttpStatus, InternalServerErrorException, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../../shared/filters/AllExceptionsFilter';
import { JwtAuthenticationGuard } from '../../auth/guards/JwtAuthenticationGuard';
import { UpgradeCardUseCase } from '../application/UpgradeCardUseCase/UpgradeCardUseCase';
import { ControllerResponseOnError } from '../../shared/core/presentation/ControllerResponse';
import { CardControllerUpgradeRequestBody } from './dto/CardControllerRequest';
import { ControllerRequestAuthCommonHeader } from '../../shared/core/presentation/ControllerRequest';

@Controller('cards')
@ApiTags('Card')
export class CardController {
  constructor(
    private readonly upgradeCardUseCase: UpgradeCardUseCase,
  ) {}

  @Post('upgrade')
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: '카드 강화', description: `아래는 강화에 대한 정책임.

강화비용 500원

강화재료는 2개까지 사용 가능.

1개 추가될 때마다 x 로 늘어남

작은 대상을 두고 높은 카드를 재료로 사용하는 것은 막는다
(= B일 때 재료는 B, A만 된다, A일 때 재료는 A만 된다.)

S는 강화대상이 아니다.

ATTRACTION은 강화대상이 아니다.

대상과 재료가 일치할 때 (대상이 B이고 재료가 B일 때, 대상이 A이고 재료가 A일 때)
- 추가되는 B는 다음단계 성공확률 50% 상승
- 추가되는 A는 다음단계 성공확률 30% 상승

대상과 재료가 차이날 때 (대상이 B이고 재료가 A인 경우 밖에 없음)
- 추가되는 A는 다음단계 성공확률 50% 상승

그렇기 때문에 두장을 쓰면 100% 확률이 됨 항상.` })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ControllerResponseOnError })
  @ApiForbiddenResponse({ description: 'Forbidden', type: ControllerResponseOnError })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ControllerResponseOnError })
  async upgrade(
    @Headers() headers: ControllerRequestAuthCommonHeader,
    @Body() body: CardControllerUpgradeRequestBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!request.user) {
        throw new ForbiddenException();
      }

      const { ok, card } = await this.upgradeCardUseCase.execute({
        username: request.user as string,
        sourceCardsId: body.sourceCardsId,
        targetCardId: body.targetCardId,
      });

      if (!ok) {
        throw new InternalServerErrorException();
      }

      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {
          card: {
            id: card.id,
            type: card.type,
            name: card.name,
            description: card.description,
            address: card.address,
            estimatedHours: card.estimatedHours,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
