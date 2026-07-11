import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { mapDrawRow, type DrawRow } from "@/lib/mapDraw";
import type { LottoDraw } from "@/types/lotto";

const MIN_VALUE = 1;
const MAX_VALUE = 49;

type SuccessResponse = {
  number: number;
  count: number;
  draws: LottoDraw[];
};

type ErrorResponse = {
  error: string;
};

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  const raw = request.nextUrl.searchParams.get("number");

  if (!raw) {
    return NextResponse.json(
      { error: "Brak wymaganego parametru ?number=" },
      { status: 400 },
    );
  }

  const number = Number(raw);

  if (
    !Number.isInteger(number) ||
    number < MIN_VALUE ||
    number > MAX_VALUE
  ) {
    return NextResponse.json(
      {
        error: `Parametr number musi być liczbą całkowitą z zakresu ${MIN_VALUE}-${MAX_VALUE}`,
      },
      { status: 400 },
    );
  }

  try {
    // Zapytanie parametryzowane - number nigdy nie trafia bezpośrednio do SQL,
    // co chroni przed SQL injection mimo że sami je wcześniej walidujemy.
    const result = await pool.query<DrawRow>(
      "SELECT * FROM draws WHERE $1 = ANY(numbers) ORDER BY draw_date DESC",
      [number],
    );

    return NextResponse.json({
      number,
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