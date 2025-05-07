"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/header/navigation";
import ToasterProvider from "@/app/tosterproviders";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showNavigation = ["/", "/products", "/basket"].includes(pathname);

  return (
    <>
      {showNavigation && <Navigation />}
      <ToasterProvider />
      {children}
    </>
  );
}
