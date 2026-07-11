import type { NextRequest } from "next/server";
import { saveDraws } from "@/lib/draws";
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

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Nieprawidłowy JSON" }, { status: 400 });
  }

  const draws = (body as { draws?: unknown })?.draws;

  if (!Array.isArray(draws) || !draws.every(isLottoDraw)) {
    return Response.json(
      { error: "Pole 'draws' musi być tablicą obiektów LottoDraw" },
      { status: 400 }
    );
  }

  try {
    const result = await saveDraws(draws);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Nieznany błąd" },
      { status: 500 }
    );
  }
}