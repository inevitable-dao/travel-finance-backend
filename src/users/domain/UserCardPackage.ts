import { CardPackage } from '../../cardPackages/domain/CardPackage';
import { User } from './User';
import { AggregateRoot } from '../../shared/core/domain/AggregateRoot';
import { Result } from '../../shared/core/domain/Result';

interface UserCardPackageProps {
  user: User;
  cardPackage: CardPackage;
  registerDatetime: string;
}

export class UserCardPackage extends AggregateRoot<UserCardPackageProps, number> {
  private constructor(props: UserCardPackageProps, id: number) {
    super(props, id);
  }

  public static create(props: UserCardPackageProps, id: number): Result<UserCardPackage> {
    return Result.ok<UserCardPackage>(new UserCardPackage(props, id));
  }

  public static createNew(props: UserCardPackageProps): Result<UserCardPackage> {
    return this.create(props, 0);
  }

  get user(): User {
    return this.props.user;
  }

  get cardPackage(): CardPackage {
    return this.props.cardPackage;
  }

  get registerDatetime(): string {
    return this.props.registerDatetime;
  }
}
