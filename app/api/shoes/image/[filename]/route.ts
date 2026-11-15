//app/api/shoes/image/[filename]/route.ts
import fs from "fs";
import path from "path";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;

  if (filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "public/shoes", filename);
    const buffer = fs.readFileSync(filePath);

    // Określ typ MIME na podstawie rozszerzenia
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";
    
    if (ext === ".webp") contentType = "image/webp";
    if (ext === ".pdf") contentType = "application/pdf";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}