import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { EventsView } from "@/components/events/EventsView";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function EventsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("Events");

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="font-display text-3xl uppercase tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="text-sm text-ink-faint">{t("subtitle")}</p>
      </header>
      <EventsView />
    </div>
  );
}
