import { Inject } from '@nestjs/common';
import { UseCase } from '../../../shared/core/application/UseCase';
import { GetUserOwnedCardsUseCaseRequest } from './dto/GetUserOwnedCardsUseCaseRequest';
import { GetUserOwnedCardsUseCaseResponse } from './dto/GetUserOwnedCardsUseCaseResponse';
import { USER_REPOSITORY, UserRepository } from '../../infrastructure/UserRepository';

export class GetUserOwnedCardsUseCase implements UseCase<GetUserOwnedCardsUseCaseRequest, GetUserOwnedCardsUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: GetUserOwnedCardsUseCaseRequest): Promise<GetUserOwnedCardsUseCaseResponse> {
    const userCards = await this.userRepository.getUserCards(request.username);

    return {
      ok: true,
      cards: userCards.map(userCard => userCard.card),
    };
  }
}
