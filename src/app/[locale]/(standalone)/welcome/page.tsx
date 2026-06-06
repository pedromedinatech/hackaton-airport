import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function WelcomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <WelcomeScreen />;
}
