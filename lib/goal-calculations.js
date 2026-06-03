export function calculateGoalMetrics({ goal, monthlyIncome, monthlyExpenses }) {
  const target = Number(goal.targetAmount);
  const current = Number(goal.currentAmount);
  const remaining = target - current;
  const now = new Date();
  const deadline = new Date(goal.deadline);
  const months = Math.max(
    1,
    (deadline.getFullYear() - now.getFullYear()) * 12 +
      (deadline.getMonth() - now.getMonth()),
  );

  const requiredMonthly = remaining / months;
  const availableToSave = monthlyIncome - monthlyExpenses;
  const isFeasible = availableToSave >= requiredMonthly;
  const shortfall = isFeasible ? 0 : requiredMonthly - availableToSave;
  const monthsAtCurrentRate =
    availableToSave > 0 ? Math.ceil(remaining / availableToSave) : Infinity;

  return {
    remaining,
    months,
    requiredMonthly,
    availableToSave,
    isFeasible,
    shortfall,
    monthsAtCurrentRate,
    progressPercent: Math.min(100, (current / target) * 100),
  };
}
