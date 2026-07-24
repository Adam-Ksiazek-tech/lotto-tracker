import { useState, useCallback } from "react";
import { message } from "antd";
import type { DragEndEvent } from "@dnd-kit/core";

const MAX_SELECTED = 6;

type UseLottoSelectionReturn = {
  selected: number[];
  onRemove: (number: number) => void;
  handleDragEnd: (event: DragEndEvent) => void;
};

export function useLottoSelection(): UseLottoSelectionReturn {
  const [selected, setSelected] = useState<number[]>([]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
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
  }, []);

  const onRemove = useCallback((number: number) => {
    setSelected((prev) => prev.filter((x) => x !== number));
  }, []);

  return { selected, onRemove, handleDragEnd };
}