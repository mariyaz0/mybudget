import { getGoals } from "@/actions/goals";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoalList } from "./_components/goal-list";
import { GoalForm } from "./_components/goal-form";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function GoalsPage() {
  const { userId } = await auth();
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });

  const now = new Date();
  const [goals, transactions, defaultAccount] = await Promise.all([
    getGoals(),
    db.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: startOfMonth(now), lte: endOfMonth(now) },
      },
    }),
    db.account.findFirst({
      where: { userId: user.id, isDefault: true },
    }),
  ]);

  const monthlyIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-title">Финансовые цели</h1>
          <p className="text-muted-foreground mt-1">
            Планируй будущее, откладывай осознанно
          </p>
        </div>
        <GoalForm />
      </div>
      <GoalList
        goals={goals}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        defaultAccountId={defaultAccount?.id ?? null}
      />
    </div>
  );
}
