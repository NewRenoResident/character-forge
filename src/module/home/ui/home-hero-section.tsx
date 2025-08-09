import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const HomeHeroSection = () => {
  return (
    <>
      <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/line-mountains.webp"
          alt=""
          fill
          priority
          className="object-cover blur-xs dark:brightness-50"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 z-10" />

        <div className="relative z-20 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Craft Your Hero&apos;s Tale
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed drop-shadow-md">
            Unleash your creativity and bring your D&D characters to life with
            our intuitive character creation tool. Explore a vast array of
            options, from races and classes to backgrounds and equipment, all
            within a sleek, user-friendly interface.
          </p>
          <Button size="lg">Get Started for Free</Button>
        </div>
      </div>
      <div>
        <h1></h1>
      </div>
    </>
  );
};
