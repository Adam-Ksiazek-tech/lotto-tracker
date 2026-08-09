import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const shoesDir = path.join(process.cwd(), "public/shoes");

    if (!fs.existsSync(shoesDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(shoesDir).filter((file) =>
      /\.(webp|jpg|jpeg|png)$/i.test(file)
    );

    const images = files.map((file) => ({
      name: file,
      src: `/api/shoes/image/${encodeURIComponent(file)}`,
    }));

    images.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(images);
  } catch (error) {
    console.error("Błąd przy odczytywaniu folder shoes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}