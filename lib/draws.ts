import { pool } from "@/lib/db";
import type { LottoDraw } from "@/types/lotto";

async function insertDraw(draw: LottoDraw): Promise<boolean> {
  const result = await pool.query(
    `INSERT INTO draws (draw_date, numbers, draw_type)
     VALUES ($1, $2, 'lotto')
     ON CONFLICT (draw_date) DO NOTHING
     RETURNING id`,
    [draw.drawDate, draw.numbers]
  );

  return (result.rowCount ?? 0) > 0;
}

async function refreshNumberFrequency(): Promise<void> {
  await pool.query("REFRESH MATERIALIZED VIEW number_frequency");
}

export async function saveDraw(draw: LottoDraw): Promise<{ inserted: boolean }> {
  const inserted = await insertDraw(draw);
  if (inserted) {
    await refreshNumberFrequency();
  }
  return { inserted };
}

export async function saveDraws(
  draws: LottoDraw[]
): Promise<{ insertedCount: number; totalCount: number }> {
  let insertedCount = 0;

  for (const draw of draws) {
    if (await insertDraw(draw)) {
      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    await refreshNumberFrequency();
  }

  return { insertedCount, totalCount: draws.length };
}