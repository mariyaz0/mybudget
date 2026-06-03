"use client";

import { useState, useEffect } from "react";
import { calculateGoalMetrics } from "@/lib/goal-calculations";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Target,
  TrendingUp,
  AlertTriangle,
  Trash2,
  Pencil,
  Check,
  Sparkles,
  PiggyBank,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";
import {
  updateGoalDeadline,
  contributeToGoal,
  deleteGoal,
} from "@/actions/goals";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const fmt = (n) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n);

export function GoalCard({
  goal,
  monthlyIncome,
  monthlyExpenses,
  defaultAccountId,
}) {
  const metrics = calculateGoalMetrics({
    goal,
    monthlyIncome,
    monthlyExpenses,
  });
  const isCompleted = metrics.progressPercent >= 100;

  const [editingDate, setEditingDate] = useState(false);
  const [newDeadline, setNewDeadline] = useState(
    format(new Date(goal.deadline), "yyyy-MM-dd"),
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevProgress, setPrevProgress] = useState(metrics.progressPercent);

  // Запускаем анимацию если только что достигли 100%
  useEffect(() => {
    if (prevProgress < 100 && metrics.progressPercent >= 100) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    setPrevProgress(metrics.progressPercent);
  }, [metrics.progressPercent]);

  const handleDateSave = async () => {
    try {
      await updateGoalDeadline(goal.id, newDeadline);
      toast.success("Дата обновлена");
      setEditingDate(false);
    } catch {
      toast.error("Ошибка обновления даты");
    }
  };

  const handleContribute = async () => {
    if (!defaultAccountId) {
      toast.error("Нет счёта по умолчанию");
      return;
    }
    try {
      await contributeToGoal(
        goal.id,
        metrics.requiredMonthly,
        defaultAccountId,
      );
      toast.success(`${fmt(metrics.requiredMonthly)} отложено на цель!`);
    } catch (e) {
      toast.error(e.message || "Ошибка");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(goal.id);
      toast.success("Цель удалена");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  return (
    <Card
      className={`border-none shadow-md relative overflow-hidden transition-all duration-300 ${
        isCompleted ? "ring-2 ring-green-400" : ""
      }`}
    >
      {/* Анимация достижения цели */}
      {showCelebration && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-green-50/90 dark:bg-green-950/90 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <Sparkles className="h-12 w-12 text-yellow-500 mx-auto animate-bounce" />
            <p className="text-xl font-bold text-green-700">
              Цель достигнута! 🎉
            </p>
            <p className="text-sm text-green-600">{goal.name}</p>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {isCompleted ? (
              <Sparkles className="h-5 w-5 text-yellow-500" />
            ) : (
              <Target className="h-5 w-5 text-blue-500" />
            )}
            {goal.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <Badge className="bg-green-100 text-green-700 border-green-300">
                Достигнута ✓
              </Badge>
            ) : metrics.isFeasible ? (
              <Badge
                variant="outline"
                className="text-green-600 border-green-300"
              >
                Достижимо
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-500 border-red-300">
                Сложно
              </Badge>
            )}

            {/* Удаление */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить цель?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Цель «{goal.name}» будет удалена безвозвратно.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Прогресс */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Накоплено</span>
            <span className="font-medium">
              {fmt(Number(goal.currentAmount))} /{" "}
              {fmt(Number(goal.targetAmount))}
            </span>
          </div>
          <Progress
            value={metrics.progressPercent}
            className={`h-2 ${isCompleted ? "[&>div]:bg-green-500" : ""}`}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Осталось {fmt(metrics.remaining)}
          </p>
        </div>

        {/* Дата с редактированием */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Дедлайн:</span>
          {editingDate ? (
            <>
              <Input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="h-7 text-xs w-36"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={handleDateSave}
              >
                <Check className="h-3.5 w-3.5 text-green-600" />
              </Button>
            </>
          ) : (
            <>
              <span className="font-medium">
                {format(new Date(goal.deadline), "d MMM yyyy", { locale: ru })}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => setEditingDate(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>

        {/* Расчёт */}
        {!isCompleted && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> Нужно в месяц
              </span>
              <span className="font-semibold">
                {fmt(metrics.requiredMonthly)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Доступно сейчас</span>
              <span
                className={
                  metrics.isFeasible
                    ? "text-green-600 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {fmt(metrics.availableToSave)}
              </span>
            </div>
          </div>
        )}

        {/* Кнопка отложить — только если достижимо */}
        {!isCompleted && metrics.isFeasible && defaultAccountId && (
          <Button
            onClick={handleContribute}
            className="w-full gap-2"
            variant="outline"
          >
            <PiggyBank className="h-4 w-4" />
            Отложить {fmt(metrics.requiredMonthly)} сейчас
          </Button>
        )}

        {/* Предупреждение */}
        {!isCompleted && !metrics.isFeasible && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-700 dark:text-red-400 font-medium">
                При текущих расходах цель недостижима к сроку
              </p>
              <p className="text-red-600 dark:text-red-500 mt-1">
                Сократите расходы на {fmt(metrics.shortfall)} в месяц. При
                текущем темпе — ещё{" "}
                {metrics.monthsAtCurrentRate === Infinity
                  ? "∞"
                  : metrics.monthsAtCurrentRate}{" "}
                мес.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
