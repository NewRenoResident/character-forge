import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export const ContinueWithBlock = () => {
  const handleGithub = async () => {
    const { data, error } = await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onSuccess,
      }
    );
  };
  return (
    <>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full">
        <Separator />

        <p className="px-2">or</p>
        <Separator />
      </div>
      <Button variant="outline" className="w-full">
        <FaGoogle />
        Continue with Google
      </Button>
      <Button variant="outline" onClick={handleGithub} className="w-full">
        <FaGithub />
        Continue with Github
      </Button>
    </>
  );
};
