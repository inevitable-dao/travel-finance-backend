export interface CreateJourneyUseCaseRequest {
  username: string;
  startDatetime: string;
  endDatetime: string;
  cardsId: number[];
}
