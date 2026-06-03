export const defaultCategories = [
  {
    id: "goal",
    name: "Финансовая цель",
    type: "EXPENSE",
    color: "#f59e0b", // amber-500
    icon: "Target",
  },
  // Категории доходов
  {
    id: "salary",
    name: "Зарплата",
    type: "INCOME",
    color: "#22c55e", // green-500
    icon: "Wallet",
  },
  {
    id: "freelance",
    name: "Фриланс",
    type: "INCOME",
    color: "#06b6d4", // cyan-500
    icon: "Laptop",
  },
  {
    id: "investments",
    name: "Инвестиции",
    type: "INCOME",
    color: "#6366f1", // indigo-500
    icon: "TrendingUp",
  },
  {
    id: "business",
    name: "Бизнес",
    type: "INCOME",
    color: "#ec4899", // pink-500
    icon: "Building",
  },
  {
    id: "rental",
    name: "Аренда",
    type: "INCOME",
    color: "#f59e0b", // amber-500
    icon: "Home",
  },
  {
    id: "other-income",
    name: "Прочие доходы",
    type: "INCOME",
    color: "#64748b", // slate-500
    icon: "Plus",
  },

  // Категории расходов
  {
    id: "housing",
    name: "Жильё",
    type: "EXPENSE",
    color: "#ef4444", // red-500
    icon: "Home",
    subcategories: ["Аренда", "Ипотека", "Налог на имущество", "Обслуживание"],
  },
  {
    id: "transportation",
    name: "Транспорт",
    type: "EXPENSE",
    color: "#f97316", // orange-500
    icon: "Car",
    subcategories: [
      "Топливо",
      "Общественный транспорт",
      "Обслуживание",
      "Парковка",
    ],
  },
  {
    id: "groceries",
    name: "Продукты",
    type: "EXPENSE",
    color: "#84cc16", // lime-500
    icon: "Shopping",
  },
  {
    id: "utilities",
    name: "Коммунальные услуги",
    type: "EXPENSE",
    color: "#06b6d4", // cyan-500
    icon: "Zap",
    subcategories: ["Электричество", "Вода", "Газ", "Интернет", "Телефон"],
  },
  {
    id: "entertainment",
    name: "Развлечения",
    type: "EXPENSE",
    color: "#8b5cf6", // violet-500
    icon: "Film",
    subcategories: ["Кино", "Игры", "Стриминговые сервисы"],
  },
  {
    id: "food",
    name: "Кафе и рестораны",
    type: "EXPENSE",
    color: "#f43f5e", // rose-500
    icon: "UtensilsCrossed",
  },
  {
    id: "shopping",
    name: "Покупки",
    type: "EXPENSE",
    color: "#ec4899", // pink-500
    icon: "ShoppingBag",
    subcategories: ["Одежда", "Электроника", "Товары для дома"],
  },
  {
    id: "healthcare",
    name: "Здоровье",
    type: "EXPENSE",
    color: "#14b8a6", // teal-500
    icon: "HeartPulse",
    subcategories: ["Медицина", "Стоматология", "Аптека", "Страховка"],
  },
  {
    id: "education",
    name: "Образование",
    type: "EXPENSE",
    color: "#6366f1", // indigo-500
    icon: "GraduationCap",
    subcategories: ["Обучение", "Книги", "Курсы"],
  },
  {
    id: "personal",
    name: "Уход за собой",
    type: "EXPENSE",
    color: "#d946ef", // fuchsia-500
    icon: "Smile",
    subcategories: ["Стрижка", "Спортзал", "Косметика"],
  },
  {
    id: "travel",
    name: "Путешествия",
    type: "EXPENSE",
    color: "#0ea5e9", // sky-500
    icon: "Plane",
  },
  {
    id: "insurance",
    name: "Страхование",
    type: "EXPENSE",
    color: "#64748b", // slate-500
    icon: "Shield",
    subcategories: ["Жизнь", "Жильё", "Авто"],
  },
  {
    id: "gifts",
    name: "Подарки и пожертвования",
    type: "EXPENSE",
    color: "#f472b6", // pink-400
    icon: "Gift",
  },
  {
    id: "bills",
    name: "Счета и комиссии",
    type: "EXPENSE",
    color: "#fb7185", // rose-400
    icon: "Receipt",
    subcategories: ["Банковские комиссии", "Штрафы", "Платежи за услуги"],
  },
  {
    id: "other-expense",
    name: "Прочие расходы",
    type: "EXPENSE",
    color: "#94a3b8", // slate-400
    icon: "MoreHorizontal",
  },
];

export const categoryColors = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});
