import { UseCase } from '../../../shared/core/application/UseCase';
import { RevealCardPackageUseCaseRequest } from './dto/RevealCardPackageUseCaseRequest';
import { RevealCardPackageUseCaseResponse } from './dto/RevealCardPackageUseCaseResponse';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { CARD_PACKAGE_REPOSITORY, CardPackageRepository } from '../../infrastructure/CardPackageRepository';
import { USER_REPOSITORY, UserRepository } from '../../../users/infrastructure/UserRepository';
import { CARD_REPOSITORY, CardRepository } from '../../../cards/infrastructure/CardRepository';
import { CardType } from '../../../cards/domain/CardType';
import { CardPicker } from '../../domain/CardPicker';
import { Card } from '../../../cards/domain/Card';
import { UserCard } from '../../../users/domain/UserCard';
import * as dayjs from 'dayjs';

export class RevealCardPackageUseCase implements UseCase<RevealCardPackageUseCaseRequest, RevealCardPackageUseCaseResponse> {
  constructor(
    @Inject(CARD_PACKAGE_REPOSITORY)
    private readonly cardPackageRepository: CardPackageRepository,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: RevealCardPackageUseCaseRequest): Promise<RevealCardPackageUseCaseResponse> {
    const cards = await this.cardRepository.findAllByPackage(request.cardPackageId);
    if (cards.length <= 2) {
      throw new InternalServerErrorException('Card package has equal or less than 2 cards');
    }

    const transportCards = cards.filter(card => card.type === CardType.TRANSPORT);
    let pickedTransportCards: Card[] = [];
    pickedTransportCards = CardPicker.pickRandomByWeight(transportCards);
    if (!pickedTransportCards[0]) {
      const shuffled = CardPicker.shuffle<Card>(transportCards);
      if (shuffled[0]) {
        pickedTransportCards = [shuffled[0]];
      }
    }

    const stayCards = cards.filter(card => card.type === CardType.STAY);
    let pickedStayCards: Card[] = [];
    pickedStayCards = CardPicker.pickRandomByWeight(stayCards);
    if (!pickedStayCards[0]) {
      const shuffled = CardPicker.shuffle<Card>(stayCards);
      if (shuffled[0]) {
        pickedStayCards = [shuffled[0]];
      }
    }

    const mealCards = cards.filter(card => card.type === CardType.MEAL);
    let pickedMealCards: Card[] = [];
    pickedMealCards = CardPicker.pickRandomByWeight(mealCards, 2);
    if (!pickedMealCards[0]) {
      const shuffled = CardPicker.shuffle<Card>(mealCards);
      if (shuffled[0] && shuffled[1]) {
        pickedMealCards = [shuffled[0], shuffled[1]];
      }
    }

    const attractionsAndActivitiesCards = cards.filter(card => card.type === CardType.ATTRACTION || card.type === CardType.ACTIVITY);
    let pickedAttractionsAndActivitiesCard = [];
    pickedAttractionsAndActivitiesCard = CardPicker.pickRandomByWeight(attractionsAndActivitiesCards, 2);
    if (!pickedAttractionsAndActivitiesCard[0] || !pickedAttractionsAndActivitiesCard[1]) {
      const shuffled = CardPicker.shuffle<Card>(attractionsAndActivitiesCards);
      if (shuffled[0] && shuffled[1]) {
        pickedAttractionsAndActivitiesCard = [shuffled[0], shuffled[1]];
      }
    }

    const pickedCards = [
      ...pickedTransportCards,
      ...pickedStayCards,
      ...pickedMealCards,
      ...pickedAttractionsAndActivitiesCard,
    ];

    const user = await this.userRepository.findOne(request.username);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const userCards = pickedCards.map(card => UserCard.createNew({
      user: user,
      card: card,
      isUse: true,
      registerDatetime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    }).value);

    await this.userRepository.saveCards(userCards);

    return { ok: true, cards: pickedCards };
  }
}
