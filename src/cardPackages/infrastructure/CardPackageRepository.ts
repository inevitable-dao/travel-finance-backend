import { CardPackage } from '../domain/CardPackage';

export const CARD_PACKAGE_REPOSITORY = Symbol('CARD_PACKAGE_REPOSITORY');
export interface CardPackageRepository {
  findOne(): Promise<CardPackage | null>;
}
