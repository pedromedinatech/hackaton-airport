import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import HelpChat from "@/components/help/HelpChat";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function HelpPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <HelpChat />;
}
