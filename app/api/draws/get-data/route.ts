import type { LottoDraw } from "@/types/lotto";

function isLottoDraw(value: unknown): value is LottoDraw {
  if (typeof value !== "object" || value === null) return false;
  const d = value as Record<string, unknown>;
  return (
    typeof d.drawDate === "string" &&
    typeof d.drawSystemId === "number" &&
    Array.isArray(d.numbers) &&
    d.numbers.every((n) => typeof n === "number")
  );
}

export async function GET() {
  const apiUrl = process.env.LOTTO_PUBLIC_API_URL;

  if (!apiUrl) {
    return Response.json(
      { error: "Brak zmiennej LOTTO_PUBLIC_API_URL" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(apiUrl, {
      // dane losowań nie zmieniają się co sekundę - cache na 5 min
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return Response.json(
        { error: `Zewnętrzne API zwróciło błąd: ${res.status}` },
        { status: 502 }
      );
    }

    const data: unknown = await res.json();
    const draws = Array.isArray(data) ? data : (data as { draws?: unknown })?.draws;

    if (!Array.isArray(draws) || !draws.every(isLottoDraw)) {
      return Response.json(
        { error: "Nieprawidłowy format danych z zewnętrznego API" },
        { status: 502 }
      );
    }

    return Response.json({ draws });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Nieznany błąd" },
      { status: 500 }
    );
  }
}