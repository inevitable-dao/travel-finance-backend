import { BadRequestException, Inject } from '@nestjs/common';
import { UseCase } from '../../../shared/core/application/UseCase';
import { UserSignUpUseCaseRequest } from './dto/UserSignUpUseCaseRequest';
import { UserSignUpUseCaseResponse } from './dto/UserSignUpUseCaseResponse';
import { USER_REPOSITORY, UserRepository } from '../../infrastructure/UserRepository';
import { User } from '../../domain/User';

export class UserSignUpUseCase implements UseCase<UserSignUpUseCaseRequest, UserSignUpUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: UserSignUpUseCaseRequest): Promise<UserSignUpUseCaseResponse> {
    const existUser = await this.userRepository.findOne(request.username);
    if (existUser !== null) {
      throw new BadRequestException('User already exists');
    }

    const user = User.createNew({
      username: request.username,
      password: request.password,
      point: 0,
    }).value;

    await this.userRepository.save(user);

    return { ok: true };
  }
}
