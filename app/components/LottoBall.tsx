type Props = {
  number: number;
  variant?: "default" | "muted";
};

export function LottoBall({ number, variant = "default" }: Props) {
  return (
    <span
      className={
        "inline-flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-semibold shadow-sm " +
        (variant === "default"
          ? "bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 dark:from-amber-400 dark:to-amber-600"
          : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300")
      }
    >
      {number}
    </span>
  );
}