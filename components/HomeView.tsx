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

import { useDraws } from "@/lib/hooks/useDraws";
import { useMatchResults } from "@/lib/hooks/useMatchResults";
import { useLottoSelection } from "@/lib/hooks/useLottoSelection";

import type { LottoDraw } from "@/types/lotto";

const { Content, Sider } = Layout;

const MAX_SELECTED = 6;

type Props = {
  isLoggedIn: boolean;
};
export function HomeView({ isLoggedIn }: { isLoggedIn: boolean }) {
  
  const { draws, loading, error } = useDraws();
  const { selected, onRemove, handleDragEnd } = useLottoSelection();
  const { matches, matchLoading, matchError } = useMatchResults(selected);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

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
                <BallDropZone selected={selected} onRemove={onRemove} />
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