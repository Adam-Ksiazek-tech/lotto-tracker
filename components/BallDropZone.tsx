"use client";

import { Card, Typography } from "antd";
import { useDroppable } from "@dnd-kit/core";
import { LottoBall } from "./LottoBall";

const { Title, Text } = Typography;

type Props = {
  selected: number[];
  onRemove: (number: number) => void;
};

export function BallDropZone({ selected, onRemove }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "drop-zone" });

  return (
    <Card className="dark:!bg-slate-900 dark:!border-slate-800">
      <Title level={4} className="!mb-1 dark:!text-slate-100">
        Twój zestaw
      </Title>
      {selected.length > 0 && (
        <Text type="secondary" className="text-xs">
          Kliknij piłeczkę, żeby ją usunąć
        </Text>
      )}
      <div
        ref={setNodeRef}
        className={`min-h-[100px] flex flex-wrap gap-2 items-center justify-center rounded-lg border-2 border-dashed px-4 py-3 mt-3 transition-colors ${
          isOver
            ? "border-red-500 bg-red-50 dark:bg-red-950/30"
            : "border-slate-300 dark:border-slate-700"
        }`}
      >
        {selected.length === 0 && (
          <span className="text-slate-400 dark:text-slate-500 text-center">
            Przesuń piłeczki tutaj
          </span>
        )}
        {selected.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onRemove(n)}
            className="cursor-pointer hover:opacity-60 transition-opacity bg-transparent border-none p-0 m-0 appearance-none"
            aria-label={`Usuń ${n} z zestawu`}
          >
            <LottoBall number={n} />
          </button>
        ))}
      </div>
    </Card>
  );
}