export interface UpgradeCardUseCaseRequest {
  username: string;
  targetCardId: number;
  sourceCardsId: number[];
}
