import { useState, useEffect } from "react";
import type { LottoDraw } from "@/types/lotto";

type UseMatchResultsReturn = {
  matches: LottoDraw[];
  matchLoading: boolean;
  matchError: string | null;
};

export function useMatchResults(selected: number[]): UseMatchResultsReturn {
  const [matches, setMatches] = useState<LottoDraw[]>([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  useEffect(() => {
    if (selected.length === 0) {
      setMatches([]);
      setMatchError(null);
      setMatchLoading(false);
      return;
    }

    const controller = new AbortController();
    setMatchLoading(true);
    setMatchError(null);

    fetch(`/api/draws/by-numbers?numbers=${selected.join(",")}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          throw new Error(body?.error ?? `${res.status} ${res.statusText}`);
        }
        return body as { numbers: number[]; count: number; draws: LottoDraw[] };
      })
      .then((data) => setMatches(data.draws))
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setMatches([]);
        setMatchError(err instanceof Error ? err.message : "Nieznany błąd");
      })
      .finally(() => setMatchLoading(false));

    return () => controller.abort();
  }, [selected]);

  return { matches, matchLoading, matchError };
}