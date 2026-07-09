export type LottoDrawResult = {
  drawDate: string; // ISO date
  drawSystemId: number;
  results: number[]; // 6 wylosowanych liczb
};