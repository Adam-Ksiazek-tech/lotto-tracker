export type LottoDraw = {
  drawSystemId: number;
  drawDate: string;
  numbers: number[];
};

export type LottoDrawsResponse = {
  meta: {
    gameType: string;
    lastFetchedAt: string;
    source: string;
  };
  draws: LottoDraw[];
};