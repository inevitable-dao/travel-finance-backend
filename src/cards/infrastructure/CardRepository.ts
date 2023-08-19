import { Card } from '../domain/Card';
import { CardRank } from '../domain/CardRank';
import { CardType } from '../domain/CardType';

export const CARD_REPOSITORY = Symbol('CARD_REPOSITORY');

export interface CardRepository {
  findAllByPackage(cardPackageId: number): Promise<Card[]>;
  findAllByRankAndType(rank: CardRank, type: CardType): Promise<Card[]>;
}
