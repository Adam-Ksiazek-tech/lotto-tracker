import type { LottoDraw } from "@/types/lotto";

// Kształt wiersza tak, jak zwraca go PostgreSQL (kolumny snake_case).
// Dostosuj nazwy pól, jeśli Twoja tabela `draws` nazywa je inaczej.
export type DrawRow = {
  draw_system_id: number;
  draw_date: string;
  numbers: number[];
};

export function mapDrawRow(row: DrawRow): LottoDraw {
  return {
    drawSystemId: row.draw_system_id,
    drawDate: row.draw_date,
    numbers: row.numbers,
  };
}