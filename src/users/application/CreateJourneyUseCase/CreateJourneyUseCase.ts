import { UseCase } from '../../../shared/core/application/UseCase';
import { CreateJourneyUseCaseRequest } from './dto/CreateJourneyUseCaseRequest';
import { CreateJourneyUseCaseResponse } from './dto/CreateJourneyUseCaseResponse';
import { JOURNEY_REPOSITORY, JourneyRepository } from '../../infrastructure/JourneyRepository';
import { BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { Journey } from '../../domain/Journey';
import { USER_REPOSITORY, UserRepository } from '../../infrastructure/UserRepository';

export class CreateJourneyUseCase implements UseCase<CreateJourneyUseCaseRequest, CreateJourneyUseCaseResponse> {
  constructor(
    @Inject(JOURNEY_REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: CreateJourneyUseCaseRequest): Promise<CreateJourneyUseCaseResponse> {
    const user = await this.userRepository.findOne(request.username);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const userCards = await this.userRepository.getUserCards(request.username);
    if (userCards.length < request.cardsId.length) {
      throw new BadRequestException('Not enough cards');
    }

    for (const cardId of request.cardsId) {
      const card = userCards.find(userCard => userCard.card.id === cardId);
      if (!card) {
        throw new BadRequestException('Card not found from this user');
      }
    }

    const journey = Journey.createNew({
      user,
      startDatetime: request.startDatetime,
      endDatetime: request.endDatetime,
      cards: userCards.filter(userCard => request.cardsId.includes(userCard.card.id)).map(userCard => userCard.card),
    }).value;

    await this.journeyRepository.save(journey);

    return { ok: true };
  }
}
