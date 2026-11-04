"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { useEffect } from "react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isExcludedPage = pathname === "/vision-ai" || pathname === "/onboarding";

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  return (
    <>
      {children}
      {!isExcludedPage && <Navbar />}
    </>
  );
}