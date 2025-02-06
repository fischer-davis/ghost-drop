import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { db } from "@/server/db";
import { files } from "@/server/db/schema";
import { broadcastProgress } from "@/server/websocket";

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

    const uniqueFilename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const chunkSize = Math.ceil(fileBuffer.length / 10); // Simulate chunked upload
    for (let i = 0; i < fileBuffer.length; i += chunkSize) {
      await new Promise((res) => setTimeout(res, 200)); // Simulate delay
      const progress = Math.round(((i + chunkSize) / fileBuffer.length) * 100);
      broadcastProgress(progress); // Send real-time updates
    }

    // Save file
    fs.writeFileSync(filePath, fileBuffer);

    // Store metadata in SQLite
    await db.insert(files).values({
      filename: file.name,
      filePath: `/dev/${uniqueFilename}`,
      fileSize: fileBuffer.length,
    });

    broadcastProgress(100); // Ensure progress reaches 100%

    return NextResponse.json({ success: true, filePath: `/dev/${uniqueFilename}` });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
