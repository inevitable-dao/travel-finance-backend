import { Body, Controller, Headers, ForbiddenException, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../../shared/filters/AllExceptionsFilter';
import { ControllerResponseOnError } from '../../shared/core/presentation/ControllerResponse';
import { Request, Response } from 'express';
import { UserSignUpUseCase } from '../application/UserSignUpUseCase/UserSignUpUseCase';
import { UserControllerSignInRequestBody, UserControllerSignUpRequestBody } from './dto/UserControllerRequest';
import { UserSignInUseCase } from '../application/UserSignInUseCase/UserSignInUseCase';
import { JwtAuthenticationGuard } from '../../auth/guards/JwtAuthenticationGuard';
import { GetUserOwnedCardsUseCase } from '../application/GetUserOwnedCardsUseCase/GetUserOwnedCardsUseCase';
import { ControllerRequestAuthCommonHeader } from '../../shared/core/presentation/ControllerRequest';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userSignUpUseCase: UserSignUpUseCase,
    private readonly userSignInUseCase: UserSignInUseCase,
    private readonly getUserOwnedCardsUseCase: GetUserOwnedCardsUseCase,
  ) {}

  @Post('sign-up')
  @UseFilters(AllExceptionsFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '회원가입' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ControllerResponseOnError })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ControllerResponseOnError })
  async signUp(
    @Body() body: UserControllerSignUpRequestBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { ok } = await this.userSignUpUseCase.execute({ username: body.username, password: body.password });

    if (!ok) {
      throw new InternalServerErrorException();
    }

    try {
      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {},
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('sign-in')
  @UseFilters(AllExceptionsFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ControllerResponseOnError })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ControllerResponseOnError })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ControllerResponseOnError })
  async signIn(
    @Body() body: UserControllerSignInRequestBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { ok, token } = await this.userSignInUseCase.execute({ username: body.username, password: body.password });

    if (!ok) {
      throw new InternalServerErrorException();
    }

    try {
      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {
          token: token,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('me/cards')
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '소유한 카드들 조회' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ControllerResponseOnError })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ControllerResponseOnError })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ControllerResponseOnError })
  async getUserOwnedCards(
    @Headers() headers: ControllerRequestAuthCommonHeader,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!request.user) {
        throw new ForbiddenException();
      }

      const { ok, cards } = await this.getUserOwnedCardsUseCase.execute({
        username: request.user as string,
      });

      if (!ok) {
        throw new InternalServerErrorException();
      }

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
