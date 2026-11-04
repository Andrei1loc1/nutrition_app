import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const { searchParams } = new URL(request.url);
    const portion = searchParams.get("portion") || "full";

    const res = await fetch(`${BACKEND_URL}/predict?portion=${encodeURIComponent(portion)}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Prediction failed", detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
