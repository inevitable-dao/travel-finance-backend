import { User } from '../domain/User';
import { UserCardPackage } from '../domain/UserCardPackage';
import { UserCard } from '../domain/UserCard';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findOne(username: string): Promise<User | null>;
  findUser(username: string, password: string): Promise<User | null>;
  save(user: User): Promise<void>;

  usePoint(username: string, pointAmount: number): Promise<void>;
  useCard(username: string, cardId: number): Promise<void>;

  saveCardPackage(cardPackage: UserCardPackage): Promise<void>;

  saveCards(cards: UserCard[]): Promise<void>;
  getUserCards(username: string): Promise<UserCard[]>;
}
