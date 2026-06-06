import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, rest: ["not-found"] }));
}

export default function CatchAllPage() {
  notFound();
}
