import * as XLSX from "xlsx";

export function exportTransactionsToExcel(transactions) {
  const data = transactions.map((t) => ({
    Date: new Date(t.date).toLocaleDateString("ru-RU"),
    Description: t.description || "",
    Type: t.type === "EXPENSE" ? "Расход" : "Доход",
    Amount: t.type === "EXPENSE" ? -Number(t.amount) : Number(t.amount),
    Category: t.category,
    "Recurring?": t.isRecurring ? "Yes" : "No",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Ширина колонок
  worksheet["!cols"] = [
    { wch: 14 }, // Date
    { wch: 30 }, // Description
    { wch: 10 }, // Type
    { wch: 12 }, // Amount
    { wch: 18 }, // Category
    { wch: 12 }, // Recurring
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  XLSX.writeFile(workbook, `transactions_${Date.now()}.xlsx`);
}
