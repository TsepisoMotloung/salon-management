"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Navigation from "./Navigation";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Navigation />
      <main className="flex-1 md:mb-0 mb-20">
        {children}
      </main>
    </div>
  );
}
