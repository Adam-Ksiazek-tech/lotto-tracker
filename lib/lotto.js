export async function getLottoDraws(limit) {
  const apiUrl = process.env.LOTTO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("Brak zmiennej środowiskowej LOTTO_PUBLIC_API_URL");
  }

  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://www.lottostats.pl/",
    },
    next: { revalidate: 10 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("LOTTO API error body:", body);
    throw new Error(`Błąd pobierania danych: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const draws = Array.isArray(data.draws) ? data.draws : [];
  const limited =
    typeof limit === "number" && limit > 0 ? draws.slice(0, limit) : draws;

  return { meta: data.meta, draws: limited };
}