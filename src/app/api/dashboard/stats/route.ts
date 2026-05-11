import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getDateRange } from "@/utils/format";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = getDateRange("day");

    // Get today's bookings
    const todayBookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: today.start,
          lte: today.end,
        },
      },
    });

    // Get today's transactions
    const todayTransactions = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: today.start,
          lte: today.end,
        },
      },
    });

    const todayIncome = todayTransactions
      .filter((t) => t.type === "money-in")
      .reduce((sum, t) => sum + t.amount, 0);

    const todayExpenses = todayTransactions
      .filter((t) => t.type === "money-out")
      .reduce((sum, t) => sum + t.amount, 0);

    // Get low stock items
    const lowStockItems = await prisma.inventory.findMany({
      where: { quantity: { lte: 5 } },
      orderBy: { quantity: "asc" },
      take: 5,
    });

    // Get upcoming bookings
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: new Date(),
        },
        status: "Pending",
      },
      orderBy: { bookingDate: "asc" },
      take: 5,
    });

    // Calculate total cash
    const allTransactions = await prisma.transaction.findMany();
    let totalCash = 0;
    for (const t of allTransactions) {
      if (t.type === "money-in") {
        totalCash += t.amount;
      } else if (t.type === "money-out") {
        totalCash -= t.amount;
      } else if (t.type === "investment") {
        totalCash -= t.amount;
      } else if (t.type === "withdrawal") {
        totalCash -= t.amount;
      }
    }

    const stats = {
      todayBookings: todayBookings.length,
      todayIncome,
      todayExpenses,
      todayProfit: todayIncome - todayExpenses,
      availableCash: totalCash,
      lowStockItems,
      upcomingBookings,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
