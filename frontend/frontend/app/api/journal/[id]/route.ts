import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const userId = request.headers.get("X-User-ID");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.meal.delete({
      where: { id, userId },
    });

    return NextResponse.json({ data: { id } });
  } catch {
    return NextResponse.json({ error: "Meal not found" }, { status: 404 });
  }
}
