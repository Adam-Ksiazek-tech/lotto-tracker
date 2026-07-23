import type { LottoDraw } from "@/types/lotto";

export function transformLottoPlData(data: any[]): LottoDraw[] {
  return data
    .filter((item) => item.gameType === "Lotto") // Tylko Lotto, nie LottoPlus
    .map((item) => {
      const resultsJson = item.results?.[0]?.resultsJson || [];
      
      return {
        drawSystemId: item.drawSystemId,
        drawDate: item.drawDate,
        numbers: resultsJson.sort((a: number, b: number) => a - b),
      };
    });
}