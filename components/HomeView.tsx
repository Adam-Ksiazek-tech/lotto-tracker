"use client";

import { useEffect, useState } from "react";
import { Layout, Alert, Spin, message } from "antd";
import { DndContext, type DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { AppHeader } from "@/components/AppHeader";
import { RandomLottoBalls } from "@/components/RandomLottoBalls";
import { LatestDraw } from "@/components/LatestDraw";
import { DrawHistory } from "@/components/DrawHistory";
import { BallDropZone } from "@/components/BallDropZone";
import { MatchResults } from "@/components/MatchResults";
import { AllLottoBalls } from "@/components/AllLottoBalls";
import { Footer } from "@/components/Footer";
import type { LottoDraw } from "@/types/lotto";

const { Content, Sider } = Layout;

const MAX_SELECTED = 6;

type Props = {
  isLoggedIn: boolean;
};
export function HomeView({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [draws, setDraws] = useState<LottoDraw[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState<LottoDraw[]>([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || over.id !== "drop-zone") return;

    const number = active.data.current?.number as number | undefined;
    if (!number) return;

    setSelected((prev) => {
      if (prev.includes(number)) return prev;
      if (prev.length >= MAX_SELECTED) {
        message.warning(`Możesz wybrać maksymalnie ${MAX_SELECTED} liczb`);
        return prev;
      }
      return [...prev, number].sort((a, b) => a - b);
    });
  };

  const [latest, ...previous] = draws;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Layout className="min-h-screen !bg-slate-50 dark:!bg-slate-950">
        <AppHeader />

        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 pt-4 sm:pt-8">
          
            {latest && <LatestDraw draw={latest} />}
          
        </div>

        {isLoggedIn ? (
          <Layout className="!bg-transparent max-w-6xl mx-auto w-full flex-col lg:flex-row">
            <Content className="p-4 sm:p-8 flex flex-col gap-6">
              {loading && <Spin />}
              {error && (
                <Alert type="error" message="Nie udało się pobrać wyników" description={error} showIcon />
              )}
              <RandomLottoBalls />
              {previous.length > 0 && <DrawHistory draws={previous} />}
            </Content>
            <Sider width={340} theme="light" breakpoint="lg" collapsedWidth={0} trigger={null}
              className="!bg-transparent p-4 sm:p-8 pt-0 lg:pt-8 pl-4 sm:pl-8 lg:pl-0 !max-w-full lg:!max-w-[340px] !flex-none lg:!flex-shrink-0"
              style={{ flex: "0 0 auto" }}>
              <div className="flex flex-col gap-6">
                <BallDropZone selected={selected} onRemove={(n) => setSelected(prev => prev.filter(x => x !== n))} />
                <MatchResults selected={selected} matches={matches} matchLoading={matchLoading} matchError={matchError} />
                <AllLottoBalls selected={selected} />
              </div>
            </Sider>
          </Layout>
        ) : (
          <div className="max-w-3xl mx-auto w-full p-4 sm:p-8">
            <Alert message="Zaloguj się, aby zobaczyć więcej funkcji" type="info" showIcon />
          </div>
        )}

        <Footer />
      </Layout>
    </DndContext>
  );
}