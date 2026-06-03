import { GoalCard } from "./goal-card";

export function GoalList({
  goals,
  monthlyIncome,
  monthlyExpenses,
  defaultAccountId,
}) {
  const active = goals.filter(
    (g) => Number(g.currentAmount) < Number(g.targetAmount),
  );
  const completed = goals.filter(
    (g) => Number(g.currentAmount) >= Number(g.targetAmount),
  );

  return (
    <div className="space-y-10">
      {active.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
            Активные цели
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                defaultAccountId={defaultAccountId}
              />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
            Достигнутые цели 🎉
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                defaultAccountId={defaultAccountId}
              />
            ))}
          </div>
        </section>
      )}

      {goals.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">Нет целей. Создай первую!</p>
        </div>
      )}
    </div>
  );
}
