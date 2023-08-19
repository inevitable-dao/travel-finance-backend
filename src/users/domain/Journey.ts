import { User } from './User';
import { Card } from '../../cards/domain/Card';
import { AggregateRoot } from '../../shared/core/domain/AggregateRoot';
import { Result } from '../../shared/core/domain/Result';

interface JourneyProps {
  user: User;
  startDatetime: string;
  endDatetime: string;
  cards: Card[];
}

export class Journey extends AggregateRoot<JourneyProps, number> {
  private constructor(props: JourneyProps, id: number) {
    super(props, id);
  }

  public static create(props: JourneyProps, id: number): Result<Journey> {
    return Result.ok<Journey>(new Journey(props, id));
  }

  public static createNew(props: JourneyProps): Result<Journey> {
    return this.create(props, 0);
  }

  get user(): User {
    return this.props.user;
  }

  get startDatetime(): string {
    return this.props.startDatetime;
  }

  get endDatetime(): string {
    return this.props.endDatetime;
  }

  get cards(): Card[] {
    return this.props.cards;
  }
}
