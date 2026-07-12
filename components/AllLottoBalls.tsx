"use client";

import { Card, Typography } from "antd";
import { DraggableBall } from "./DraggableBall";

const { Title } = Typography;

const ALL_NUMBERS = Array.from({ length: 49 }, (_, i) => i + 1);

type Props = {
  selected: number[];
};

export function AllLottoBalls({ selected }: Props) {
  return (
    <Card className="dark:!bg-slate-900 dark:!border-slate-800">
      <Title level={4} className="!mb-3 dark:!text-slate-100">
        Wszystkie liczby
      </Title>
      <div className="flex flex-wrap gap-2">
        {ALL_NUMBERS.map((n) => (
          <DraggableBall key={n} number={n} disabled={selected.includes(n)} />
        ))}
      </div>
    </Card>
  );
}