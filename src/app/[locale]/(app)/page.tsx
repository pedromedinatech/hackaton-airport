import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import HomeGreeting from "@/components/feed/HomeGreeting";
import ServicesGrid from "@/components/feed/ServicesGrid";
import UpcomingArrivals from "@/components/feed/UpcomingArrivals";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <HomeGreeting />
      <ServicesGrid />
      <UpcomingArrivals />
    </div>
  );
}
