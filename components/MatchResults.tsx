"use client";

import { Card, Typography, Spin, Alert, List } from "antd";
import type { LottoDraw } from "@/types/lotto";

const { Title, Text } = Typography;

type Props = {
  selected: number[];
  matches: LottoDraw[];
  matchLoading: boolean;
  matchError: string | null;
};

export function MatchResults({ selected, matches, matchLoading, matchError }: Props) {
  if (selected.length === 0) return null;

  return (
    <Card className="dark:!bg-slate-900 dark:!border-slate-800">
      <Title level={5} className="!mb-3 dark:!text-slate-100">
        Historia tego zestawu
      </Title>

      {matchLoading && (
        <div className="flex justify-center py-2">
          <Spin size="small" />
        </div>
      )}

      {!matchLoading && matchError && (
        <Alert
          type="error"
          message="Nie udało się przeszukać bazy"
          description={matchError}
          showIcon
        />
      )}

      {!matchLoading && !matchError && (
        <>
          <Text type="secondary">
            {matches.length > 0
              ? `Ten zestaw padał już ${matches.length} raz(y):`
              : "Ten zestaw liczb nigdy jeszcze nie padł."}
          </Text>

          {matches.length > 0 && (
            <div className="max-h-64 overflow-y-auto mt-2 pr-1">
              <List
                size="small"
                dataSource={matches}
                renderItem={(draw) => (
                  <List.Item className="!px-0">
                    <Text className="dark:!text-slate-300">
                      {draw.drawDate} · losowanie #{draw.drawSystemId}
                    </Text>
                  </List.Item>
                )}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}