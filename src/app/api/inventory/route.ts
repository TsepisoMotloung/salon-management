import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search");
    const lowStockOnly = searchParams.get("lowStock");

    let where = {};

    if (search) {
      where = {
        itemName: { contains: search, mode: "insensitive" },
      };
    }

    if (lowStockOnly === "true") {
      where = { ...where, quantity: { lte: 5 } };
    }

    const inventory = await prisma.inventory.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const item = await prisma.inventory.create({
      data: body,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    );
  }
}
