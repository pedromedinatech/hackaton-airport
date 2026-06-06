import type { ReactNode } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import OfflineBanner from "@/components/layout/OfflineBanner";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <OfflineBanner />
      <TopBar />
      <main className="mx-auto w-full max-w-md px-4 pb-28 pt-4">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
