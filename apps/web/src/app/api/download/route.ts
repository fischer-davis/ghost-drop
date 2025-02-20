import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Define storage path for local use (outside src/)
const uploadDir = path.join(process.cwd(), "dev");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return NextResponse.json(
      { error: "File name is required" },
      { status: 400 },
    );
  }

  const filePath = path.join(uploadDir, fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileType = path.extname(fileName).substring(1);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": `application/${fileType}`,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
