import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { TRANSPORT } from "@/data";
import { TransportCard } from "@/components/cards/TransportCard";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function TransportPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("Transport");

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-ink">{t("title")}</h1>
        <p className="text-sm text-ink-faint">{t("subtitle")}</p>
      </header>
      <div className="space-y-3">
        {TRANSPORT.map((option) => (
          <TransportCard key={option.id} option={option} />
        ))}
      </div>
    </div>
  );
}
