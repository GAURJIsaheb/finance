"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header/header";
import Footer from "../components/footer/footer";
import { Toaster } from "sonner";

export default function Provider({ children }) {
  // const pathname = usePathname();
  // const hideLayoutHeader=["/sign-in", "/sign-up"].includes(pathname);
  // const hideLayoutFooter = ["/sign-in", "/sign-up"].includes(pathname) || pathname.startsWith("/account/") || pathname.startsWith("/transactions/");

  return (
    // <>
    //   {!hideLayoutHeader && <Header />}
    //   <main className="flex-1">{children}</main>
    //   <Toaster richColors/>
    //   {!hideLayoutFooter && <Footer />}
    // </>
    <div>
      {children}
    </div>
  );
}
