import fs from "fs";
import path from "path";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const filename = params.filename;

  if (filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "public/shoes", filename);
    console.log("Szukam:", filePath);
    console.log("Istnieje:", fs.existsSync(filePath));
    
    const buffer = fs.readFileSync(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Błąd:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}