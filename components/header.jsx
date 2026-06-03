"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox, Target } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo (2).png"
            alt="welth logo"
            height={60}
            width={200}
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center space-x-4">
          {isSignedIn && (
            <>
              <Link href="/dashboard">
                <Button variant="outline">
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Панель управления</span>
                </Button>
              </Link>

              <Link href="/goals">
                <Button variant="outline">
                  <Target size={18} />
                  <span className="hidden md:inline">Цели</span>
                </Button>
              </Link>

              <Link href="/transaction/create">
                <Button className="flex items-center gap-2">
                  <PenBox size={18} />
                  <span className="hidden md:inline">Новая операция</span>
                </Button>
              </Link>
            </>
          )}

          {!isSignedIn && (
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Зарегистрироваться</Button>
            </SignInButton>
          )}

          {isSignedIn && <UserButton />}
        </div>
      </nav>
    </div>
  );
};

export default Header;
