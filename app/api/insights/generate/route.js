import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateFinancialInsights } from "@/lib/gigachat";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [transactions, accounts] = await Promise.all([
      db.transaction.findMany({
        where: { userId: dbUser.id, date: { gte: thirtyDaysAgo } },
      }),
      db.account.findMany({ where: { userId: dbUser.id } }),
    ]);

    if (transactions.length < 3) {
      return Response.json({ insights: [], message: "Недостаточно данных" });
    }

    const result = await generateFinancialInsights(transactions, accounts);

    return Response.json({ insights: result.insights });
  } catch (error) {
    console.error("Insights error:", error);
    return Response.json(
      { error: error.message, stack: error.stack },
      { status: 500 },
    );
  }
}
