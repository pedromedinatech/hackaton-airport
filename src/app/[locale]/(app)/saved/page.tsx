import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import SavedView from "@/components/saved/SavedView";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SavedPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("Saved");

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-ink">{t("title")}</h1>
        <p className="text-sm text-ink-faint">{t("subtitle")}</p>
      </header>
      <SavedView />
    </div>
  );
}
