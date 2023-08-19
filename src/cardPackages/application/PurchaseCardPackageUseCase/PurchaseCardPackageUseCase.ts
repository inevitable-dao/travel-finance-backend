import { UseCase } from '../../../shared/core/application/UseCase';
import { PurchaseCardPackageUseCaseRequest } from './dto/PurchaseCardPackageUseCaseRequest';
import { PurchaseCardPackageUseCaseResponse } from './dto/PurchaseCardPackageUseCaseResponse';
import { USER_REPOSITORY, UserRepository } from '../../../users/infrastructure/UserRepository';
import { ForbiddenException, Inject } from '@nestjs/common';
import { CARD_PACKAGE_REPOSITORY, CardPackageRepository } from '../../infrastructure/CardPackageRepository';
import { UserCardPackage } from '../../../users/domain/UserCardPackage';
import * as dayjs from 'dayjs';

export class PurchaseCardPackageUseCase implements UseCase<PurchaseCardPackageUseCaseRequest, PurchaseCardPackageUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(CARD_PACKAGE_REPOSITORY)
    private readonly cardPackageRepository: CardPackageRepository,
  ) {}

  async execute(request: PurchaseCardPackageUseCaseRequest): Promise<PurchaseCardPackageUseCaseResponse> {
    const user = await this.userRepository.findOne(request.username);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const cardPackage = await this.cardPackageRepository.findOne();
    if (!cardPackage) {
      throw new ForbiddenException('Card package not found');
    }

    if (user.point < cardPackage.price) {
      throw new ForbiddenException('Not enough point');
    }

    await this.userRepository.usePoint(request.username, cardPackage.price);

    const userCardPackage = UserCardPackage.createNew({
      user: user,
      cardPackage: cardPackage,
      registerDatetime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    }).value;

    await this.userRepository.saveCardPackage(userCardPackage);

    return { ok: true };
  }
}
