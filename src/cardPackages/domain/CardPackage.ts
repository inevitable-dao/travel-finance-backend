import { AggregateRoot } from '../../shared/core/domain/AggregateRoot';
import { Result } from '../../shared/core/domain/Result';

interface CardPackageProps {
  name: string;
  originalPrice: number;
  price: number;
}

export class CardPackage extends AggregateRoot<CardPackageProps, number> {
  private constructor(props: CardPackageProps, id: number) {
    super(props, id);
  }

  public static create(props: CardPackageProps, id: number): Result<CardPackage> {
    return Result.ok<CardPackage>(new CardPackage(props, id));
  }

  public static createNew(props: CardPackageProps): Result<CardPackage> {
    return this.create(props, 0);
  }

  get name(): string {
    return this.props.name;
  }

  get originalPrice(): number {
    return this.props.originalPrice;
  }

  get price(): number {
    return this.props.price;
  }
}
