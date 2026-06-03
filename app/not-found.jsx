import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
      <h1 className="text-6xl gradient font-bold gradient-title mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
      <p className="text-gray-600 mb-8">
        К сожалению, запрашиваемая страница не существует или была перемещена
      </p>
      <Link href="/">
        <Button>На главную</Button>
      </Link>
    </div>
  );
}
