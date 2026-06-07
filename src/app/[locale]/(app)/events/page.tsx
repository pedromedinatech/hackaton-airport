import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

function EventsListSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="space-y-2 rounded-2xl border border-white/[0.06] bg-surface p-4"
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

const EventsView = dynamic(
  () => import("@/components/events/EventsView").then((m) => ({ default: m.EventsView })),
  { ssr: false, loading: EventsListSkeleton },
);

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
      <header>
        <h1 className="font-display text-3xl uppercase tracking-tight text-ink">
          {t("title")}
        </h1>
      </header>
      <EventsView />
    </div>
  );
}
