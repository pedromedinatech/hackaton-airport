import Link from "next/link";
import { Compass } from "lucide-react";

// Kept free of next-intl so the 404 boundary never depends on request-scoped
// locale context (which isn't guaranteed when this boundary is rendered).
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Compass size={40} className="text-ink-faint" aria-hidden />
      <h1 className="text-lg font-bold text-ink">Page not found</h1>
      <Link
        href="/"
        className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back home
      </Link>
    </div>
  );
}
