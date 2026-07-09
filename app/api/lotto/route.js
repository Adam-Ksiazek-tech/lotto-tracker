import { NextResponse } from "next/server";
import { getLottoDraws } from "@/lib/lotto";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  if (limitParam && (Number.isNaN(limit) || limit <= 0)) {
    return NextResponse.json(
      { error: "Parametr 'limit' musi być liczbą dodatnią" },
      { status: 400 }
    );
  }

  try {
    const data = await getLottoDraws(limit);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}