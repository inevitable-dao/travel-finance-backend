import { ForbiddenException, Inject } from '@nestjs/common';
import { UseCase } from '../../../shared/core/application/UseCase';
import { GetUserJourneysUseCaseRequest } from './dto/GetUserJourneysUseCaseRequest';
import { GetUserJourneysUseCaseResponse } from './dto/GetUserJourneysUseCaseResponse';
import { JOURNEY_REPOSITORY, JourneyRepository } from '../../infrastructure/JourneyRepository';
import { USER_REPOSITORY, UserRepository } from '../../infrastructure/UserRepository';

export class GetUserJourneysUseCase implements UseCase<GetUserJourneysUseCaseRequest, GetUserJourneysUseCaseResponse> {
  constructor(
    @Inject(JOURNEY_REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: GetUserJourneysUseCaseRequest): Promise<GetUserJourneysUseCaseResponse> {
    const user = await this.userRepository.findOne(request.username);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const journeys = await this.journeyRepository.findAll(user.id);

    return { ok: true, journeys };
  }
}
