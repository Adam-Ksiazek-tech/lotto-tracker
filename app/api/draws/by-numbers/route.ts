import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { mapDrawRow, type DrawRow } from "@/lib/mapDraw";
import type { LottoDraw } from "@/types/lotto";

const MIN_VALUE = 1;
const MAX_VALUE = 49;
const MIN_COUNT = 1;
const MAX_COUNT = 6;

type SuccessResponse = {
  numbers: number[];
  count: number;
  draws: LottoDraw[];
};

type ErrorResponse = {
  error: string;
};

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  const raw = request.nextUrl.searchParams.get("numbers");

  if (!raw) {
    return NextResponse.json(
      { error: "Brak wymaganego parametru ?numbers= (np. ?numbers=11,13,26)" },
      { status: 400 },
    );
  }

  const numbers = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number);

  if (numbers.length < MIN_COUNT || numbers.length > MAX_COUNT) {
    return NextResponse.json(
      { error: `Podaj od ${MIN_COUNT} do ${MAX_COUNT} liczb` },
      { status: 400 },
    );
  }

  const invalid = numbers.some(
    (n) => !Number.isInteger(n) || n < MIN_VALUE || n > MAX_VALUE,
  );

  if (invalid) {
    return NextResponse.json(
      { error: `Każda liczba musi być całkowita, z zakresu ${MIN_VALUE}-${MAX_VALUE}` },
      { status: 400 },
    );
  }

  const uniqueNumbers = Array.from(new Set(numbers));

  try {
    // "numbers @> $1" - kolumna numbers (array) musi zawierać WSZYSTKIE
    // przekazane liczby. Tablica przekazana jako parametr, bez sklejania
    // stringów, więc jest to bezpieczne pod kątem SQL injection.
    const result = await pool.query<DrawRow>(
      "SELECT * FROM draws WHERE numbers @> $1::int[] ORDER BY draw_date DESC",
      [uniqueNumbers],
    );

    return NextResponse.json({
      numbers: uniqueNumbers,
      count: result.rowCount ?? result.rows.length,
      draws: result.rows.map(mapDrawRow),
    });
  } catch (err) {
    console.error("Błąd zapytania do bazy:", err);
    return NextResponse.json(
      { error: "Nie udało się pobrać danych z bazy" },
      { status: 500 },
    );
  }
}