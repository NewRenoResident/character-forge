import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/module/theme/theme-toggle";
import { Link } from "@/shared/ui/link";
import { Panda } from "lucide-react";
import React from "react";

export const HomeHeader = () => {
  return (
    <header className="border-b items-center flex py-2 px-4 gap-4 w-full justify-between">
      <div className="flex items-center gap-4">
        <Panda className="size-6" />
        <h1 className="text-lg font-semibold tracking-tight whitespace-nowrap">
          Character Forge
        </h1>
      </div>
      <nav className="flex items-center">
        <div className="hidden items-center md:flex ">
          <Link underline="none" className="hover:text-black">
            Features
          </Link>
          <Link underline="none" className="hover:text-black">
            Pricing
          </Link>
          <Link underline="none" className="hover:text-black">
            Support
          </Link>
        </div>
        <div className="hidden sm:flex">
          <Button className="mr-2" variant="secondary">
            Login
          </Button>
          <Button className="mr-2" variant="secondary">
            Sign Up
          </Button>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
};
