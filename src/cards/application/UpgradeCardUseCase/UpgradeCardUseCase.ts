import { UseCase } from '../../../shared/core/application/UseCase';
import { UpgradeCardUseCaseRequest } from './dto/UpgradeCardUseCaseRequest';
import { UpgradeCardUseCaseResponse } from './dto/UpgradeCardUseCaseResponse';
import { USER_REPOSITORY, UserRepository } from '../../../users/infrastructure/UserRepository';
import { BadRequestException, ForbiddenException, Inject, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../../users/domain/User';
import { Card } from '../../domain/Card';
import { CardType } from '../../domain/CardType';
import { CardRank } from '../../domain/CardRank';
import { CARD_REPOSITORY, CardRepository } from '../../infrastructure/CardRepository';
import { CardPicker } from '../../../cardPackages/domain/CardPicker';
import { UserCard } from '../../../users/domain/UserCard';
import * as dayjs from 'dayjs';

const ONE_HUNDRED_PERCENT_SUCCESS = 100;

export class UpgradeCardUseCase implements UseCase<UpgradeCardUseCaseRequest, UpgradeCardUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepository,
  ) {}

  async execute(request: UpgradeCardUseCaseRequest): Promise<UpgradeCardUseCaseResponse> {
    if (request.sourceCardsId.length === 0) {
      throw new BadRequestException('Source cards must be 1 or more');
    }

    if (!this.isSourceCardsCountIsTwoOrLess(request.sourceCardsId)) {
      throw new BadRequestException('Source cards must be 2 or less');
    }

    const user = await this.userRepository.findOne(request.username);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!this.isUserHaveEnoughPointToUpgradeCard(user)) {
      throw new ForbiddenException('User has no enough point to upgrade');
    }

    const userCards = await this.userRepository.getUserCards(request.username);
    if (userCards.length === 0) {
      throw new BadRequestException('User has no cards');
    }

    const targetCard = userCards.find(userCard => userCard.card.id === request.targetCardId);
    if (!targetCard) {
      throw new BadRequestException('User does not have target card');
    }

    const sourceCards = userCards.filter(userCard => request.sourceCardsId.includes(userCard.card.id));
    if (sourceCards.length !== request.sourceCardsId.length) {
      throw new BadRequestException('User does not have source cards');
    }

    if (targetCard.card.type === CardType.ATTRACTION) {
      throw new BadRequestException('Attraction card cannot be upgraded');
    }

    if (targetCard.card.rank === CardRank.S) {
      throw new BadRequestException('Target card is already max grade');
    }

    if (!this.isEverySourceCardsIsSameOrLowerGradeThanTargetCard(targetCard.card, sourceCards.map(userCard => userCard.card))) {
      throw new BadRequestException('Some source cards are higher grade than target card');
    }

    let successRate = 0;

    for (const sourceCard of sourceCards) {
      if (sourceCard.card.rank === targetCard.card.rank) {
        if (sourceCard.card.rank === CardRank.B) {
          successRate += 50;
        } else if (sourceCard.card.rank === CardRank.A) {
          successRate += 30;
        }
      } else if (sourceCard.card.rank < targetCard.card.rank) {
        successRate += 50;
      }
    }

    if (successRate > ONE_HUNDRED_PERCENT_SUCCESS) {
      successRate = ONE_HUNDRED_PERCENT_SUCCESS;
    }

    let newCard: Card | null = null;

    if (successRate === ONE_HUNDRED_PERCENT_SUCCESS || Math.random() * 100 <= successRate) {
      if (targetCard.card.rank === CardRank.B) {
        const newCards = await this.cardRepository.findAllByRankAndType(CardRank.A, targetCard.card.type);
        const pickedCard = CardPicker.shuffle(newCards)[0];
        if (pickedCard) {
          newCard = pickedCard;
        }
      } else if (targetCard.card.rank === CardRank.A) {
        const newCards = await this.cardRepository.findAllByRankAndType(CardRank.S, targetCard.card.type);
        const pickedCard = CardPicker.shuffle(newCards)[0];
        if (pickedCard) {
          newCard = pickedCard;
        }
      }
    } else {
      const newCards = await this.cardRepository.findAllByRankAndType(targetCard.card.rank, targetCard.card.type);
      newCard = this.shuffleAndPickUntilCardIsNotSameAsCurrentCard(newCards, targetCard.card);
    }

    if (!newCard) {
      throw new InternalServerErrorException('Failed to upgrade card');
    }

    for (const sourceCard of sourceCards) {
      await this.userRepository.useCard(user.username, sourceCard.card.id);
    }

    const newUserCard = UserCard.createNew({
      user: user,
      card: newCard,
      isUse: true,
      registerDatetime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    }).value;
    await this.userRepository.saveCards([newUserCard]);

    return { ok: true, card: newCard };
    // 강화 100% 성공일 때는 다음 그레이드에서 셔플 돌려서 랜덤으로 카드 하나 뽑아서 줌
    // 강화 N% 성공일 때는 해당 확률로 다음 그레이드 여부 파악하되,
    // 다음 그레이드일때는, 다음 그레이드 중 셔플
    // 아닐 때는 현재 그레이드에서 셔플 (단, 지금 가진 건이 아닌 게 나올 때까지 셔플한다)
  }

  private shuffleAndPickUntilCardIsNotSameAsCurrentCard(cards: Card[], currentCard: Card): Card | null {
    let pickedCard: Card | null = null;
    do {
      pickedCard = CardPicker.shuffle(cards).length > 0 ?  CardPicker.shuffle(cards)[0]! : null;
    } while (pickedCard && pickedCard.id === currentCard.id);

    return pickedCard;
  }

  private isEverySourceCardsIsSameOrLowerGradeThanTargetCard(targetCard: Card, sourceCards: Card[]): boolean {
    return sourceCards.every(sourceCard => sourceCard.rank <= targetCard.rank);
  }

  private isSourceCardsCountIsTwoOrLess(sourceCardsId: number[]): boolean {
    return sourceCardsId.length <= 2;
  }

  private isUserHaveEnoughPointToUpgradeCard(user: User): boolean {
    return user.point >= 500;
  }
}
