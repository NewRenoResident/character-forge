import { ReactNode } from "react";

export default function ForgeLayout({ children }: { children: ReactNode }) {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      {children}
    </main>
  );
}
