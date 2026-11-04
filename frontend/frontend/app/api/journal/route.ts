import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getDateRange } from "@/lib/db/dateRange";
import { serializeMeal } from "@/lib/db/serializers";
import {
  normalizeMealType,
  normalizePortionSize,
} from "@/lib/server/validators";

export async function GET(request: Request) {
  const userId = request.headers.get("X-User-ID");
  if (!userId) {
    return NextResponse.json({ data: [], range: { start: null, end: null } });
  }

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const meals = await prisma.meal.findMany({
    where: {
      userId,
      loggedAt: { gte: start ? new Date(start) : undefined, lte: end ? new Date(end) : undefined },
    },
    include: {
      items: true,
      sourceScan: { include: { image: true } },
    },
    orderBy: { loggedAt: "asc" },
  });

  return NextResponse.json({ data: meals.map(serializeMeal), range: { start, end } });
}

export async function POST(request: Request) {
  const body = await request.json();
  const mealType = normalizeMealType(body.mealType);
  const items = Array.isArray(body.items) ? body.items : [];

  if (!body.title && items.length === 0) {
    return NextResponse.json(
      { error: "title or at least one item is required" },
      { status: 400 },
    );
  }

  const meal = await prisma.meal.create({
    data: {
      userId: request.headers.get("X-User-ID") ?? undefined,
      mealType,
      title: body.title ? String(body.title) : "",
      notes: body.notes ? String(body.notes) : null,
      loggedAt: body.loggedAt ? new Date(body.loggedAt) : new Date(),
      items: {
        create: items.map((item: { name?: unknown; quantity?: unknown; portionSize?: unknown; portionLabel?: unknown; calories?: unknown; proteinGrams?: unknown; carbsGrams?: unknown; fatGrams?: unknown }) => ({
          foodId: null,
          name: String(item.name ?? ""),
          quantity: Number(item.quantity ?? 1),
          portionSize: normalizePortionSize(item.portionSize),
          portionLabel: (item.portionLabel != null ? String(item.portionLabel) : null) as string | null,
          calories: Number(item.calories ?? 0),
          proteinGrams: Number(item.proteinGrams ?? 0),
          carbsGrams: Number(item.carbsGrams ?? 0),
          fatGrams: Number(item.fatGrams ?? 0),
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ data: serializeMeal(meal) }, { status: 201 });
}
