import { Card, Typography } from "antd";
import { LottoBall } from "./LottoBall";
import type { LottoDraw } from "@/types/lotto";

const { Title, Text } = Typography;

type Props = {
  draw: LottoDraw;
};

export function LatestDraw({ draw }: Props) {
  const sorted = [...draw.numbers].sort((a, b) => a - b);

  return (
    <Card className="dark:!bg-slate-900 dark:!border-slate-800">
      <Title level={3} className="!mb-1 dark:!text-slate-100">
        Ostatnie losowanie
      </Title>
      <Text type="secondary">
        {draw.drawDate} · losowanie #{draw.drawSystemId}
      </Text>

      <div className="flex flex-wrap gap-3 mt-6">
        {sorted.map((n) => (
          <LottoBall key={n} number={n} />
        ))}
      </div>
    </Card>
  );
}