"use client";

import { useEffect, useState } from "react";
import { Layout, Alert, Spin } from "antd";
import { AppHeader } from "@/components/AppHeader";
import { LatestDraw } from "@/components/LatestDraw";
import { DrawHistory } from "@/components/DrawHistory";
import type { LottoDraw } from "@/types/lotto";

const { Content } = Layout;

export function HomeView() {
  const [draws, setDraws] = useState<LottoDraw[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_LOTTO_API_URL;

    if (!apiUrl) {
      setError("Brak zmiennej NEXT_PUBLIC_LOTTO_API_URL");
      setLoading(false);
      return;
    }

    fetch(apiUrl)
      .then(async (res) => {
        console.log("status:", res.status, res.statusText);
        console.log("headers:", Object.fromEntries(res.headers.entries()));

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          console.error("body:", body);
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        const fetched: LottoDraw[] = Array.isArray(data.draws)
          ? data.draws.slice(0, 5)
          : [];
        setDraws(fetched);

        // Zapis do naszej bazy w tle - front pobrał dane (bo backend nie
        // ma wychodzącego dostępu do lottostats.pl), więc to front
        // przekazuje je dalej do zapisu. Nie blokujemy UI na wynik tego
        // zapisu - jeśli się nie uda, użytkownik i tak widzi wyniki,
        // po prostu nie trafią jeszcze do bazy.
        if (fetched.length > 0) {
          fetch("/api/draws", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ draws: fetched }),
          }).catch((err) => {
            console.error("Nie udało się zapisać losowań do bazy:", err);
          });
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Nieznany błąd");
      })
      .finally(() => setLoading(false));
  }, []);

  const [latest, ...previous] = draws;

  return (
    <Layout className="min-h-screen !bg-slate-50 dark:!bg-slate-950">
      <AppHeader />
      <Content className="p-4 sm:p-8 max-w-3xl mx-auto w-full flex flex-col gap-6">
        {loading && <Spin />}
        {error && (
          <Alert
            type="error"
            message="Nie udało się pobrać wyników"
            description={error}
            showIcon
          />
        )}
        {latest && <LatestDraw draw={latest} />}
        {previous.length > 0 && <DrawHistory draws={previous} />}
      </Content>
    </Layout>
  );
}