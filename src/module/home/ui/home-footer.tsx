import { Link } from "@/shared/ui/link";
import React from "react";

export const HomeFooter = () => {
  return (
    <div className="flex border-t w-full items-center py-2 px-12 gap-4 justify-between">
      <div className="hidden sm:flex sm:gap-4 mr-auto ml-auto lg:ml-0">
        <Link underline="none">Terms of Service</Link>
        <Link underline="none">Privacy Policy</Link>
        <Link underline="none">Contact Us</Link>
      </div>
      <p className="sm:hidden lg:block mr-auto sm:mr-0 lg-auto lg:ml-0 text-sm">
        © 2024 Character Forge. All rights reserved.
      </p>
    </div>
  );
};
