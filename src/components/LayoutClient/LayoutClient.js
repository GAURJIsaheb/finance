"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/footer/footer";

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const hideLayout = ["/sign-in", "/sign-up"].includes(pathname);

  return (
    <>
      {!hideLayout && <Header />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
