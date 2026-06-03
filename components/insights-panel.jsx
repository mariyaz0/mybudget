"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  success: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
  tip: { icon: Lightbulb, color: "text-purple-500", bg: "bg-purple-50" },
};

// 👇 вот чего не хватало
function InsightsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg p-4 bg-gray-100 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-3/4 bg-gray-200 rounded mt-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function InsightsPanel() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insights/generate")
      .then((r) => r.json())
      .then((data) => setInsights(data.insights || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <InsightsSkeleton />;
  if (!insights.length) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-500" />
          ИИ-рекомендации
        </h3>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {insights.map((insight, i) => {
          const cfg = typeConfig[insight.type] || typeConfig.info;
          const Icon = cfg.icon;
          return (
            <div key={i} className={cn("rounded-lg p-4", cfg.bg)}>
              <div className="flex items-start gap-2">
                <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", cfg.color)} />
                <div>
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
