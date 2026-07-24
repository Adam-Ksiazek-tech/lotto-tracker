import { useState, useEffect } from "react";
import type { LottoDraw } from "@/types/lotto";

type UseDrawsReturn = {
  draws: LottoDraw[];
  loading: boolean;
  error: string | null;
};

export function useDraws(): UseDrawsReturn {
  const [draws, setDraws] = useState<LottoDraw[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDraws() {
      try {
        const res = await fetch("/api/draws/get-data");

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body?.error ?? `${res.status} ${res.statusText}`);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const fetched: LottoDraw[] = Array.isArray(data.draws)
          ? data.draws.slice(0, 82)
          : [];
        setDraws(fetched);

        // Zapisz do bazy
        if (fetched.length > 0) {
          fetch("/api/draws", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ draws: fetched }),
          }).catch((err) => {
            console.error("Nie udało się zapisać losowań do bazy:", err);
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    }

    loadDraws();
  }, []);

  return { draws, loading, error };
}