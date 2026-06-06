import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import FlyView from "@/components/fly/FlyView";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FlyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("Fly");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-ink">{t("title")}</h1>
      <FlyView />
    </div>
  );
}
