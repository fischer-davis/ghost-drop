import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { db } from "@/server/db";
import { files } from "@/server/db/schema";

// Define storage path for local use (outside src/)
const uploadDir = path.join(process.cwd(), "dev");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Generate file path
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Save file
    fs.writeFileSync(filePath, fileBuffer);

    // Store metadata in SQLite
    await db.insert(files).values({
      filename: file.name,
      filePath: `/temp/${uniqueFilename}`,
      fileSize: fileBuffer.length,
    });

    return NextResponse.json({
      success: true,
      filePath: `/dev/${uniqueFilename}`,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
