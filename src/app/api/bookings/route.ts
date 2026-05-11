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
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let where = {};

    if (status) {
      where = { ...where, status };
    }

    if (dateFrom && dateTo) {
      where = {
        ...where,
        bookingDate: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { client: true },
      orderBy: { bookingDate: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
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
    let clientId = body.clientId || null;

    // If creating a new client with the booking
    if (body.createNewClient && body.createNewClient.fullname) {
      const newClient = await prisma.client.create({
        data: {
          fullname: body.createNewClient.fullname,
          phoneNumber: body.createNewClient.phoneNumber,
        },
      });
      clientId = newClient.id;
    }

    const booking = await prisma.booking.create({
      data: {
        fullname: body.fullname,
        phoneNumber: body.phoneNumber,
        styleRequested: body.styleRequested,
        mediumReached: body.mediumReached,
        bookingDate: new Date(body.bookingDate),
        estimatedAmount: body.estimatedAmount,
        notes: body.notes,
        status: body.status || "Pending",
        clientId: clientId,
      },
      include: { client: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
