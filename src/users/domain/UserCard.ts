import { Card } from '../../cards/domain/Card';
import { AggregateRoot } from '../../shared/core/domain/AggregateRoot';
import { Result } from '../../shared/core/domain/Result';
import { User } from './User';

interface UserCardProps {
  user: User;
  card: Card;
  isUse: boolean;
  registerDatetime: string;
}

export class UserCard extends AggregateRoot<UserCardProps, number> {
  private constructor(props: UserCardProps, id: number) {
    super(props, id);
  }

  public static create(props: UserCardProps, id: number): Result<UserCard> {
    return Result.ok<UserCard>(new UserCard(props, id));
  }

  public static createNew(props: UserCardProps): Result<UserCard> {
    return this.create(props, 0);
  }

  get user(): User {
    return this.props.user;
  }

  get card(): Card {
    return this.props.card;
  }

  get isUse(): boolean {
    return this.props.isUse;
  }

  get registerDatetime(): string {
    return this.props.registerDatetime;
  }
}
