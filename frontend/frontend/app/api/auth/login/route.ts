import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  const { displayName } = await request.json();
  if (!displayName?.trim()) {
    return NextResponse.json({ error: "displayName required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { displayName } });
    if (user) {
      return NextResponse.json({ id: user.id, displayName: user.displayName });
    }

    const newUser = await prisma.user.create({ data: { displayName } });
    return NextResponse.json({ id: newUser.id, displayName: newUser.displayName });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const existing = await prisma.user.findUnique({ where: { displayName } });
      if (existing) {
        return NextResponse.json({ id: existing.id, displayName: existing.displayName });
      }
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}