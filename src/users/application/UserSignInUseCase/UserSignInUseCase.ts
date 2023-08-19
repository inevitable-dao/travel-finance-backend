import * as jwt from 'jsonwebtoken';
import { UseCase } from '../../../shared/core/application/UseCase';
import { UserSignInUseCaseRequest } from './dto/UserSignInUseCaseRequest';
import { UserSignInUseCaseResponse } from './dto/UserSignInUseCaseResponse';
import { USER_REPOSITORY, UserRepository } from '../../infrastructure/UserRepository';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { config } from '../../../config';

export class UserSignInUseCase implements UseCase<UserSignInUseCaseRequest, UserSignInUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: UserSignInUseCaseRequest): Promise<UserSignInUseCaseResponse> {
    const user = await this.userRepository.findUser(request.username, request.password);
    if (user === null) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const token = jwt.sign({ sub: user.username }, config.JWT_SECRET, { expiresIn: '7d' });

    return { ok: true, token };
  }
}
