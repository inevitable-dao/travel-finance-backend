import { ForbiddenException, Inject } from '@nestjs/common';
import { UseCase } from '../../../shared/core/application/UseCase';
import { GetUserInformationUseCaseResponse } from './dto/GetUserInformationUseCaseResponse';
import { GetUserInformationUseCaseRequest } from './dto/GetUserInformationUseCaseRequest';
import { USER_REPOSITORY, UserRepository } from '../../infrastructure/UserRepository';

export class GetUserInformationUseCase implements UseCase<GetUserInformationUseCaseRequest, GetUserInformationUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: GetUserInformationUseCaseRequest): Promise<GetUserInformationUseCaseResponse> {
    const user = await this.userRepository.findOne(request.username);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return {
      ok: true,
      point: user.point,
    };
  }
}
