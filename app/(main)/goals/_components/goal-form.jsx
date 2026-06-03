"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createGoal } from "@/actions/goals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Введите название"),
  targetAmount: z.coerce.number().positive("Введите сумму"),
  currentAmount: z.coerce.number().min(0).default(0),
  deadline: z.string().min(1, "Выберите дату"),
});

export function GoalForm() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await createGoal(data);
      toast.success("Цель создана!");
      reset();
      setOpen(false);
    } catch {
      toast.error("Ошибка при создании цели");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Новая цель
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Создать цель</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label>Название</Label>
            <Input
              {...register("name")}
              placeholder="MacBook Pro, Путешествие..."
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Сумма цели (₽)</Label>
              <Input
                {...register("targetAmount")}
                type="number"
                placeholder="200 000"
              />
              {errors.targetAmount && (
                <p className="text-xs text-red-500">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Уже накоплено (₽)</Label>
              <Input
                {...register("currentAmount")}
                type="number"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Желаемая дата</Label>
            <Input {...register("deadline")} type="date" />
            {errors.deadline && (
              <p className="text-xs text-red-500">{errors.deadline.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Сохраняем..." : "Создать цель"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
