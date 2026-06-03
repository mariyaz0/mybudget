"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("hero-image-scrolled");
      } else {
        imageElement.classList.remove("hero-image-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-[90px] pb-6 gradient gradient-title">
          Управляй своими <br /> финансами
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Платформа для управления финансами, которая помогает отслеживать,
          анализировать и оптимизировать ваши расходы
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Начать
            </Button>
          </Link>
        </div>
        {/* <div className="hero-image-wrapper">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner (3).jpg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default HeroSection;
