"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export const Forge = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push("/");
      }}
    >
      Forge
    </Button>
  );
};
