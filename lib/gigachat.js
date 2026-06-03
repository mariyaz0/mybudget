import https from "https";
import fs from "fs";
import path from "path";
import GigaChat from "gigachat";

const ca = fs.readFileSync(path.join(process.cwd(), "certs/gigachat-ca.pem"));

const httpsAgent = new https.Agent({ ca });

const client = new GigaChat({
  credentials: process.env.GIGACHAT_CREDENTIALS,
  scope: process.env.GIGACHAT_SCOPE,
  httpsAgent,
});

export async function generateFinancialInsights(transactions, accounts) {
  const summary = buildFinancialSummary(transactions, accounts);

  const prompt = `
Ты финансовый советник. Проанализируй данные пользователя за последние 30 дней и дай 4-5 конкретных инсайтов.

Данные:
${JSON.stringify(summary, null, 2)}

Ответь строго в JSON (без markdown, без пояснений):
{
  "insights": [
    {
      "title": "Краткий заголовок",
      "description": "2-3 предложения с конкретным советом",
      "type": "warning" | "success" | "info" | "tip"
    }
  ]
}
`;

  const response = await client.chat({
    messages: [{ role: "user", content: prompt }],
    model: "GigaChat-2-Pro",
    temperature: 0.4,
    max_tokens: 1000,
  });

  const raw = response.choices[0].message.content;
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();

  return JSON.parse(cleaned);
}

function buildFinancialSummary(transactions, accounts) {
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);

  const byCategory = {};
  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return {
    totalBalance,
    income,
    expenses,
    savingsRate:
      income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : 0,
    topExpenseCategories: topCategories,
    accountCount: accounts.length,
  };
}
