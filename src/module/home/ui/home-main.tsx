import { HomeHeroSection } from "@/module/home/ui/home-hero-section";
import { HomeKeyFeatures } from "@/module/home/ui/home-key-features";
import React from "react";

export const HomeMain = () => {
  return (
    <main className="w-full">
      <HomeHeroSection />
      <HomeKeyFeatures />
    </main>
  );
};
