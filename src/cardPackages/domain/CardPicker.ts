import { Card } from '../../cards/domain/Card';

export class CardPicker {
  static shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  static pickRandomByWeight(cards: Card[], count = 1): Card[] {
    const rankProbabilities = [0.97, 0.025, 0.005];
    const probabilitiesSum = rankProbabilities.reduce((sum, prob) => sum + prob, 0);
    const selectedCards: Card[] = [];

    for (let i = 0; i < count; i++) {
      const randomValue = Math.random() * probabilitiesSum;

      let cumulativeProbability = 0;
      for (let rank = 0; rank < rankProbabilities.length; rank++) {
        const probability = rankProbabilities[rank];
        if (probability !== undefined) {
          cumulativeProbability += probability;
          if (randomValue <= cumulativeProbability) {
            const validCards = cards.filter(card => card.rank === rank && !selectedCards.includes(card));
            if (validCards.length > 0) {
              const selectedCard = validCards[Math.floor(Math.random() * validCards.length)];
              if (selectedCard) {
                selectedCards.push(selectedCard);
              }
            }
            break;
          }
        }
      }
    }

    return selectedCards;
  }
}
