import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
  Target,
  BellRing,
  Brain,
  FileSpreadsheet,
  Wallet,
  TrendingUp,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "2",
    label: "Активных пользователей",
  },
  {
    value: "100",
    label: "Отслеженных транзакций",
  },
  {
    value: "4.9/5",
    label: "Оценка пользователей",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <Wallet className="h-8 w-8 text-blue-600" />,
    title: "Управление счетами и транзакциями",
    description:
      "Создавайте несколько счетов, добавляйте и категоризируйте доходы и расходы, фильтруйте операции по типу и регулярности.",
  },
  {
    icon: <BellRing className="h-8 w-8 text-blue-600" />,
    title: "Контроль бюджета с уведомлениями",
    description:
      "Устанавливайте лимиты бюджета и получайте автоматические email-уведомления при достижении 80% от лимита расходов.",
  },
  {
    icon: <Target className="h-8 w-8 text-blue-600" />,
    title: "Финансовые цели",
    description:
      "Ставьте финансовые цели с дедлайнами, отслеживайте прогресс накопления и получайте ежемесячные напоминания о достижении целей.",
  },
  {
    icon: <Brain className="h-8 w-8 text-blue-600" />,
    title: "ИИ-инсайты на базе ГигаЧат",
    description:
      "Получайте персонализированные рекомендации по управлению финансами на основе анализа ваших доходов, расходов и привычек.",
  },
  {
    icon: <FileSpreadsheet className="h-8 w-8 text-blue-600" />,
    title: "Экспорт в Excel",
    description:
      "Выгружайте отфильтрованные транзакции в таблицу Excel для детального анализа, отчетности или передачи в другие сервисы.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
    title: "Аналитика и визуализация",
    description:
      "Анализируйте динамику доходов и расходов с помощью интерактивных диаграмм за разные периоды: от 7 дней до всей истории.",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Создайте аккаунт",
    description:
      "Начните работу за несколько минут через простой процесс регистрации",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Отслеживайте расходы",
    description: "Автоматически классифицируйте и отслеживайте транзакции",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Получайте инсайты",
    description:
      "Получайте рекомендации и инсайты, чтобы оптимизировать свои финансы",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Саша",
    role: "Владелица малого бизнеса",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "Welth полностью изменил то, как я управляю финансами бизнеса. Инсайты на базе ИИ помогли найти возможности для экономии, о которых я даже не подозревала.",
  },
  {
    name: "Миша",
    role: "Фрилансер",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote: "Спасибо удобно",
  },
  {
    name: "Даша",
    role: "Финансовый консультант",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "Я рекомендую MyBudget всем своим клиентам. Поддержка разных валют и детальная аналитика делают сервис идеальным для международных инвесторов.",
  },
];
