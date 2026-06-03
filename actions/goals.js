"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return db.user.findUnique({ where: { clerkUserId: userId } });
}

export async function getGoals() {
  const user = await getUser();
  return db.goal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createGoal(data) {
  const user = await getUser();
  const goal = await db.goal.create({
    data: {
      userId: user.id,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount ?? 0,
      deadline: new Date(data.deadline),
    },
  });
  revalidatePath("/goals");
  return goal;
}

export async function updateGoalDeadline(goalId, deadline) {
  const user = await getUser();
  await db.goal.update({
    where: { id: goalId, userId: user.id },
    data: { deadline: new Date(deadline) },
  });
  revalidatePath("/goals");
}

export async function contributeToGoal(goalId, amount, accountId) {
  const user = await getUser();

  const [goal, account] = await Promise.all([
    db.goal.findFirst({ where: { id: goalId, userId: user.id } }),
    db.account.findFirst({ where: { id: accountId, userId: user.id } }),
  ]);

  if (!goal || !account) throw new Error("Not found");
  if (Number(account.balance) < amount) throw new Error("Недостаточно средств");

  await db.$transaction([
    db.goal.update({
      where: { id: goalId },
      data: { currentAmount: { increment: amount } },
    }),
    db.account.update({
      where: { id: accountId },
      data: { balance: { decrement: amount } },
    }),
    db.transaction.create({
      data: {
        type: "EXPENSE",
        amount,
        description: `Вклад в цель: ${goal.name}`,
        date: new Date(),
        category: "goal",
        userId: user.id,
        accountId,
      },
    }),
  ]);

  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function deleteGoal(goalId) {
  const user = await getUser();
  await db.goal.delete({ where: { id: goalId, userId: user.id } });
  revalidatePath("/goals");
}
