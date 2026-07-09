import { Card, Typography } from "antd";
import { LottoBall } from "./LottoBall";
import type { LottoDraw } from "@/types/lotto";

const { Text } = Typography;

type Props = {
  draws: LottoDraw[];
};

export function DrawHistory({ draws }: Props) {
  if (draws.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {draws.map((draw) => {
        const sorted = [...draw.numbers].sort((a, b) => a - b);
        return (
          <Card
            key={draw.drawSystemId}
            size="small"
            className="dark:!bg-slate-900 dark:!border-slate-800"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Text type="secondary" className="whitespace-nowrap">
                {draw.drawDate}
              </Text>
              <div className="flex flex-wrap gap-2">
                {sorted.map((n) => (
                  <LottoBall key={n} number={n} variant="muted" />
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}