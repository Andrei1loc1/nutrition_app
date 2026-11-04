import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ pathname: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { pathname } = await context.params;
  const blobPath = pathname.join("/");

  try {
    const blob = await get(blobPath, { access: "private" });

    if (!blob || blob.statusCode !== 200) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return new Response(blob.stream, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": blob.blob.contentType ?? "image/jpeg",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
