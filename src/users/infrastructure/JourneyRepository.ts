import { Journey } from '../domain/Journey';

export const JOURNEY_REPOSITORY = Symbol('JOURNEY_REPOSITORY');

export interface JourneyRepository {
  save(journey: Journey): Promise<void>;
  findAll(userIndex: number): Promise<Journey[]>;
}
