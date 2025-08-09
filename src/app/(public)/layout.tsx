import { HomeFooter as Footer } from "@/module/home/ui/home-footer";
import { HomeHeader as Header } from "@/module/home/ui/home-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
