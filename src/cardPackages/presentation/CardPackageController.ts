import { Controller, ForbiddenException, Get, Headers, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AllExceptionsFilter } from '../../shared/filters/AllExceptionsFilter';
import { GetAvailableCardPackageUseCase } from '../application/GetAvailableCardPackageUseCase/GetAvailableCardPackageUseCase';
import { ControllerResponseOnError } from '../../shared/core/presentation/ControllerResponse';
import { JwtAuthenticationGuard } from '../../auth/guards/JwtAuthenticationGuard';
import { PurchaseCardPackageUseCase } from '../application/PurchaseCardPackageUseCase/PurchaseCardPackageUseCase';
import { CardPackageControllerPurchaseCardPackageRequestParam } from './dto/CardPackageControllerRequest';
import { RevealCardPackageUseCase } from '../application/RevealCardPackageUseCase/RevealCardPackageUseCase';
import { ControllerRequestAuthCommonHeader } from '../../shared/core/presentation/ControllerRequest';

@Controller('card-packages')
@ApiTags('Card Package')
export class CardPackageController {
  constructor(
    private readonly getAvailableCardPackageUseCase: GetAvailableCardPackageUseCase,
    private readonly purchaseCardPackageUseCase: PurchaseCardPackageUseCase,
    private readonly revealCardPackageUseCase: RevealCardPackageUseCase,
  ) {}

  @Get()
  @UseFilters(AllExceptionsFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '판매중인 카드 패키지 가져오기' })
  @ApiNotFoundResponse({ description: 'Bad Request', type: ControllerResponseOnError })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ControllerResponseOnError })
  async getAvailableCardPackage(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const { ok, cardPackage} = await this.getAvailableCardPackageUseCase.execute({});

      if (!ok) {
        throw new InternalServerErrorException();
      }

      if (cardPackage === null) {
        throw new NotFoundException();
      }

      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {
          availableCardPackage: {
            id: cardPackage.id,
            name: cardPackage.name,
            originalPrice: cardPackage.originalPrice,
            price: cardPackage.price,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Post(':id')
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '카드 패키지 구매하기(포인트를 사용하여) & 응답으로 팩 안에 들어있는 카드들 받기' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ControllerResponseOnError })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ControllerResponseOnError })
  async purchaseCardPackage(
    @Headers() headers: ControllerRequestAuthCommonHeader,
    @Param() params: CardPackageControllerPurchaseCardPackageRequestParam,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!request.user) {
        throw new ForbiddenException();
      }

      const { ok } = await this.purchaseCardPackageUseCase.execute({
        username: request.user as string,
        cardPackageId: params.id,
      });

      if (!ok) {
        throw new InternalServerErrorException();
      }

      const { cards } = await this.revealCardPackageUseCase.execute({
        username: request.user as string,
        cardPackageId: params.id,
      });

      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {
          cards: cards.map(card => ({
            id: card.id,
            type: card.type,
            name: card.name,
            description: card.description,
            address: card.address,
            estimatedHours: card.estimatedHours,
          })),
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
