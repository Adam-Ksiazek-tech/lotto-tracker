import type { LottoDraw } from "@/types/lotto";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { DEFAULT_API_SOURCE } from "@/lib/constants/api-sources";
import { transformLottoPlData } from "@/lib/transform-lotto-api";

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

async function getApiSourceForUser(): Promise<string> {
  const session = await auth();
  
  if (!session?.user?.email) {
    return DEFAULT_API_SOURCE;
  }

  const result = await pool.query(
    "SELECT api_source FROM user_settings WHERE email = $1",
    [session.user.email]
  );

  return result.rows[0]?.api_source || DEFAULT_API_SOURCE;
}

async function fetchFromLottostats() {
  const apiUrl = process.env.LOTTO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Brak zmiennej LOTTO_PUBLIC_API_URL");
  }

  const res = await fetch(apiUrl, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Lottostats API zwróciło błąd: ${res.status}`);
  }

  return res.json();
}

async function fetchFromLotto() {
  const apiUrl = process.env.LOTTO_ORIGIN;
  const apiSecret = process.env.LOTTO_ORIGIN_API_KEY;

  if (!apiUrl || !apiSecret) {
    throw new Error("Brak zmiennych LOTTO_ORIGIN lub LOTTO_ORIGIN_API_KEY");
  }

  const res = await fetch(apiUrl, {
    headers: {
      "accept": "application/json",
      "secret": apiSecret,
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Lotto.pl API zwróciło błąd: ${res.status}`);
  }

  return res.json();
}

export async function GET() {
  try {
    const apiSource = await getApiSourceForUser();
    
    let rawData: unknown;

    if (apiSource === "lotto.pl") {
      rawData = await fetchFromLotto();
      // Transformuj dane z lotto.pl
      const draws = transformLottoPlData(rawData);
      
      if (!Array.isArray(draws) || !draws.every(isLottoDraw)) {
        return Response.json(
          { error: "Nieprawidłowy format danych z API" },
          { status: 502 }
        );
      }

      return Response.json({ draws });
    } else {
      rawData = await fetchFromLottostats();
      const draws = Array.isArray(rawData) ? rawData : (rawData as { draws?: unknown })?.draws;

      if (!Array.isArray(draws) || !draws.every(isLottoDraw)) {
        return Response.json(
          { error: "Nieprawidłowy format danych z API" },
          { status: 502 }
        );
      }

      return Response.json({ draws });
    }
  } catch (error) {
    console.error("Error fetching draws:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Nieznany błąd" },
      { status: 500 }
    );
  }
}