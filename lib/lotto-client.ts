// Abstrakcja źródła wyników Lotto.
//
// TERAZ: korzystamy z publicznego (ale NIEOFICJALNEGO) endpointu, który
// zasila samą stronę lotto.pl. Używany też przez inne open-source'owe
// scrapery (np. github.com/pujan/lotto), więc traktujemy go jako
// wystarczająco stabilny na czas developmentu - ale może się zmienić bez
// ostrzeżenia, bo nie jest to wspierany kontrakt.
//
// DOCELOWO: po otrzymaniu klucza z developers.lotto.pl, podmieniamy tylko
// zawartość funkcji `fetchLatestResults` poniżej (endpoint + nagłówek
// autoryzacji) - reszta aplikacji korzysta z tego samego kształtu danych
// (`LottoDrawResult`), więc nic więcej się nie zmieni.

import type { LottoDrawResult } from "@/types/lotto";

// Kształt odpowiedzi z nieoficjalnego endpointu lotto.pl - może się zmienić,
// stąd trzymamy to w jednym miejscu i mapujemy na nasz własny typ powyżej.
type LottoPlUnofficialResponse = {
  items: Array<{
    drawDate: string;
    drawSystemId: number;
    results: Array<{ resultsJson: number[] }>;
  }>;
};

export async function fetchLatestResults(
  count: number = 5
): Promise<LottoDrawResult[]> {
  
  const baseUrl = process.env.LOTTO_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("Brak zmiennej środowiskowej LOTTO_PUBLIC_API_URL");
  }

  const url = new URL(baseUrl);

  url.searchParams.set("game", "Lotto");
  url.searchParams.set("index", "1");
  url.searchParams.set("size", String(count));
  url.searchParams.set("sort", "drawDate");
  url.searchParams.set("order", "DESC");

  const res = await fetch(url, {
    headers: {
      // Bez tego niektóre endpointy "dla przeglądarki" odrzucają zapytania
      // bez User-Agent.
      "User-Agent": "Mozilla/5.0 (LottoTracker personal project)",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Nie udało się pobrać wyników z lotto.pl (status ${res.status})`
    );
  }

  const data: LottoPlUnofficialResponse = await res.json();

  return data.items.map((item): LottoDrawResult => ({
    drawDate: item.drawDate,
    drawSystemId: item.drawSystemId,
    results: item.results[0]?.resultsJson ?? [],
  }));
}