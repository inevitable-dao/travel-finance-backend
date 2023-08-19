import { Result } from '../../shared/core/domain/Result';
import { AggregateRoot } from '../../shared/core/domain/AggregateRoot';

interface UserProps {
  username: string;
  password: string;
  point: number;
}

export class User extends AggregateRoot<UserProps, number> {
  private constructor(props: UserProps, id: number) {
    super(props, id);
  }

  static create(props: UserProps, id: number): Result<User> {
    return Result.ok<User>(new User(props, id));
  }

  static createNew(props: UserProps): Result<User> {
    return this.create(props, 0);
  }

  get username(): string {
    return this.props.username;
  }

  get password(): string {
    return this.props.password;
  }

  get point(): number {
    return this.props.point;
  }
}
