"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { LottoBall } from "./LottoBall";

const { Title, Text } = Typography;

const BALL_COUNT = 6;
const MIN_VALUE = 1;
const MAX_VALUE = 49;

function getRandomUniqueNumbers(count: number, min: number, max: number): number[] {
  const pool = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count).sort((a, b) => a - b);
}

export function RandomLottoBalls() {
  // Losowanie odbywa się dopiero po zamontowaniu na kliencie,
  // żeby uniknąć niezgodności między renderem SSR a klientem (hydration mismatch).
  const [numbers, setNumbers] = useState<number[] | null>(null);

  const draw = () => setNumbers(getRandomUniqueNumbers(BALL_COUNT, MIN_VALUE, MAX_VALUE));

  useEffect(() => {
    draw();
  }, []);

  return (
    <Card className="dark:!bg-slate-900 dark:!border-slate-800">
      <div className="flex items-center justify-between">
        <Title level={3} className="!mb-0 dark:!text-slate-100">
          Twój typ
        </Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={draw}
          type="text"
          aria-label="Wylosuj ponownie"
        />
      </div>
      <Text type="secondary">6 losowych liczb z zakresu 1–49</Text>

      <div className="flex flex-wrap gap-3 mt-6 min-h-[52px]">
        {numbers?.map((n) => <LottoBall key={n} number={n} />)}
      </div>
    </Card>
  );
}