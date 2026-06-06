import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import QuickActions from "@/components/feed/QuickActions";
import InterestChips from "@/components/feed/InterestChips";
import HomeFeed from "@/components/feed/HomeFeed";

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
    <div className="space-y-5">
      <QuickActions />
      <InterestChips />
      <HomeFeed />
    </div>
  );
}
