import { AggregateRoot } from '../../shared/core/domain/AggregateRoot';
import { Result } from '../../shared/core/domain/Result';
import { CardType } from './CardType';

interface CardProps {
  name: string;
  type: CardType;
  description: string;
  address: string;
  estimatedHours: number;
  costValue: number;
  rank: number;
}

export class Card extends AggregateRoot<CardProps, number> {
  private constructor(props: CardProps, id: number) {
    super(props, id);
  }

  static create(props: CardProps, id: number): Result<Card> {
    return Result.ok<Card>(new Card(props, id));
  }

  static createNew(props: CardProps): Result<Card> {
    return this.create(props, 0);
  }

  get name(): string {
    return this.props.name;
  }

  get type(): CardType {
    return this.props.type;
  }

  get description(): string {
    return this.props.description;
  }

  get address(): string {
    return this.props.address;
  }

  get estimatedHours(): number {
    return this.props.estimatedHours;
  }

  get costValue(): number {
    return this.props.costValue;
  }

  get rank(): number {
    return this.props.rank;
  }
}
