"use client";

import { useDraggable } from "@dnd-kit/core";
import { LottoBall } from "./LottoBall";

type Props = {
  number: number;
  disabled?: boolean;
};

export function DraggableBall({ number, disabled }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `ball-${number}`,
      data: { number },
      disabled,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
        opacity: disabled ? 0.3 : 1,
        touchAction: "none" as const,
        cursor: disabled ? "default" : "grab",
      }
    : {
        opacity: disabled ? 0.3 : 1,
        touchAction: "none" as const,
        cursor: disabled ? "default" : "grab",
      };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <LottoBall number={number} />
    </div>
  );
}