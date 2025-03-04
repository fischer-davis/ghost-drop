import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { Readable } from "stream";
import { SQLiteDatastore } from "@server/sqlite-data-store";
import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "nodejs", // Forces Node.js runtime
};

const tusServer = new Server({
  datastore: new SQLiteDatastore("./upload"),
  path: "/api/upload",
});

// Helper to read ReadableStream and convert to Buffer
async function streamToBuffer(stream: ReadableStream | null): Promise<Buffer> {
  if (!stream) {
    return Buffer.alloc(0); // Return an empty buffer if stream is null
  }
  const reader = stream.getReader();
  const chunks = [];
  let done, value;
  while (!done) {
    ({ done, value } = await reader.read());
    if (value) {
      chunks.push(value);
    }
  }
  return Buffer.concat(chunks);
}

// Helper to convert NextRequest -> Node.js IncomingMessage
async function convertRequest(req: NextRequest): Promise<IncomingMessage> {
  const readable = new Readable();
  readable._read = () => {}; // Required to make it a proper stream
  const buffer = await streamToBuffer(req.body);
  readable.push(buffer); // Push the request body
  readable.push(null); // Mark the end of the stream

  // Create a fake Node.js IncomingMessage
  const nodeReq = Object.assign(readable, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.nextUrl.pathname + req.nextUrl.search,
  }) as IncomingMessage;

  return nodeReq;
}

// Function to handle requests
async function handleTusRequest(req: NextRequest): Promise<Response> {
  return new Promise(async (resolve) => {
    const nodeReq = await convertRequest(req);
    const nodeRes = new ServerResponse(nodeReq);

    tusServer.handle(nodeReq, nodeRes).then(() => {
      const headers = nodeRes.getHeaders();
      const location = headers["location"] as string;

      const headersInit: HeadersInit = Object.entries(headers).map(
        ([key, value]) => [key, value as string],
      );

      if (req.method === "POST" && location) {
        resolve(
          new NextResponse(null, {
            status: 201,
            headers: {
              Location: location,
            },
          }),
        );
      } else {
        resolve(
          new NextResponse(
            nodeRes.statusCode === 204 ? null : nodeRes.statusMessage,
            {
              status: nodeRes.statusCode,
              headers: headersInit,
            },
          ),
        );
      }
    });
  });
}

// Exported handlers for Next.js App Router
export async function OPTIONS(req: NextRequest) {
  return handleTusRequest(req);
}

export async function POST(req: NextRequest) {
  return handleTusRequest(req);
}

export async function HEAD(req: NextRequest) {
  return handleTusRequest(req);
}

export async function PATCH(req: NextRequest) {
  return handleTusRequest(req);
}
