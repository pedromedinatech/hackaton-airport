import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { BagView } from "@/components/bag/BagView";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BagPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("Bag");

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-ink">{t("title")}</h1>
        <p className="text-sm text-ink-faint">{t("subtitle")}</p>
      </header>
      <BagView />
    </div>
  );
}
