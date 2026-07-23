export type ApiSource = "lottostats.pl" | "lotto.pl";

export const API_SOURCES: readonly ApiSource[] = [
  "lottostats.pl",
  "lotto.pl",
];

export const API_SOURCE_LABELS: Record<ApiSource, { name: string; description: string }> = {
  "lottostats.pl": {
    name: "lottostats.pl",
    description: "Nieoficjalne API – bez wymagania klucza",
  },
  "lotto.pl": {
    name: "lotto.pl",
    description: "Oficjalne API Loterii Polskiej",
  },
};

export const DEFAULT_API_SOURCE: ApiSource = "lottostats.pl";

export function isValidApiSource(value: unknown): value is ApiSource {
  return API_SOURCES.includes(value as ApiSource);
}