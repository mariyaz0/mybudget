// src/inngest/functions.ts

import { sendEmail } from "@/actions/send-email";
import { inngest } from "./client";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { calculateGoalMetrics } from "@/lib/goal-calculations";

export const checkBudgetAlert = inngest.createFunction(
  {
    id: "check-budget-alert",
    triggers: [{ cron: "0 */6 * * *" }],
  },
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: { where: { isDefault: true } },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user?.accounts?.[0];
      if (!defaultAccount) continue;

      await step.run(`check-budget-${budget.id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1);

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: { gte: startDate },
          },
          _sum: { amount: true },
        });

        const totalExpenses = Number(expenses._sum.amount ?? 0);
        const budgetAmount = Number(budget.amount);

        if (budgetAmount <= 0) return;

        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount: parseInt(budgetAmount).toFixed(1),
                totalExpenses: parseInt(totalExpenses).toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          });

          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }

        return { percentageUsed };
      });
    }

    return { processed: budgets.length };
  },
);

export const monthlyGoalReminder = inngest.createFunction(
  {
    id: "monthly-goal-reminder",
    triggers: [{ cron: "0 9 1 * *" }], // 1-го числа каждого месяца в 9:00
  },
  async ({ step }) => {
    const users = await step.run("fetch-users-with-goals", async () => {
      const startDate = new Date();
      startDate.setDate(1);

      return await db.user.findMany({
        where: { goals: { some: {} } },
        include: {
          goals: true,
          transactions: {
            where: { date: { gte: startDate } },
          },
        },
      });
    });

    for (const user of users) {
      await step.run(`send-goal-reminder-${user.id}`, async () => {
        const monthlyIncome = user.transactions
          .filter((t) => t.type === "INCOME")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const monthlyExpenses = user.transactions
          .filter((t) => t.type === "EXPENSE")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const activeGoals = user.goals.filter(
          (g) => Number(g.currentAmount) < Number(g.targetAmount),
        );

        if (!activeGoals.length) return;

        await sendEmail({
          to: user.email,
          subject: "📊 Ежемесячный отчёт по целям",
          react: EmailTemplate({
            userName: user.name,
            type: "goal-reminder",
            data: {
              goals: activeGoals.map((g) => {
                const metrics = calculateGoalMetrics({
                  goal: g,
                  monthlyIncome,
                  monthlyExpenses,
                });
                return {
                  name: g.name,
                  requiredMonthly: Math.round(metrics.requiredMonthly),
                  isFeasible: metrics.isFeasible,
                  progressPercent: Math.round(metrics.progressPercent),
                };
              }),
            },
          }),
        });
      });
    }

    return { processed: users.length };
  },
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

// Trigger recurring transactions with batching
export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
    triggers: [{ cron: "0 0 * * *" }],
  }, // Daily at midnight
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              {
                nextRecurringDate: {
                  lte: new Date(),
                },
              },
            ],
          },
        });
      },
    );

    // Send event for each recurring transaction in batches
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      // Send events directly using inngest.send()
      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  },
);

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    triggers: [{ event: "transaction.recurring.process" }], // ✅
    throttle: { limit: 10, period: "1m", key: "event.data.userId" },
  },
  async ({ event, step }) => {
    // Validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      // Create new transaction and update account balance in a transaction
      await db.$transaction(async (tx) => {
        // Create new transaction
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Регулярная)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        // Update account balance
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        // Update last processed date and next recurring date
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval,
            ),
          },
        });
      });
    });
  },
);

function isTransactionDue(transaction) {
  // If no lastProcessed date, transaction is due
  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);

  // Compare with nextDue date
  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

export const refreshInsights = inngest.createFunction(
  { id: "refresh-ai-insights" },
  { cron: "0 9 1 * *" }, // 1-го числа каждого месяца в 9:00
  async ({ step }) => {
    const users = await step.run("get-users", () =>
      db.user.findMany({ select: { id: true } }),
    );

    for (const user of users) {
      await step.run(`refresh-${user.id}`, async () => {
        // Инвалидируем кэш — просто удаляем старую запись
        await db.aiInsight.deleteMany({
          where: { userId: user.id },
        });
        // Следующий запрос с дашборда автоматически сгенерирует новые инсайты
      });
    }
  },
);
