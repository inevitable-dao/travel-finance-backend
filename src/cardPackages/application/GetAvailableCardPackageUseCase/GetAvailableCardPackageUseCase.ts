import { UseCase } from '../../../shared/core/application/UseCase';
import { GetAvailableCardPackageUseCaseRequest } from './dto/GetAvailableCardPackageUseCaseRequest';
import { GetAvailableCardPackageUseCaseResponse } from './dto/GetAvailableCardPackageUseCaseResponse';
import { CARD_PACKAGE_REPOSITORY, CardPackageRepository } from '../../infrastructure/CardPackageRepository';
import { Inject } from '@nestjs/common';

export class GetAvailableCardPackageUseCase implements UseCase<GetAvailableCardPackageUseCaseRequest, GetAvailableCardPackageUseCaseResponse> {
  constructor(
    @Inject(CARD_PACKAGE_REPOSITORY)
    private readonly cardPackageRepository: CardPackageRepository,
  ) {}

  async execute(request: GetAvailableCardPackageUseCaseRequest): Promise<GetAvailableCardPackageUseCaseResponse> {
    const cardPackage = await this.cardPackageRepository.findOne();

    return {
      ok: true,
      cardPackage: cardPackage,
    };
  }
}
