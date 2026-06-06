import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DEMO_TAGS } from "@/features/baggage/simulator";
import { LiveBagView } from "@/components/bag/LiveBagView";

/** Static export: pre-render the public link for the known demo tags. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DEMO_TAGS.map((tag) => ({ locale, tag })),
  );
}

export default async function LiveBagPage({
  params: { locale, tag },
}: {
  params: { locale: string; tag: string };
}) {
  setRequestLocale(locale);
  return <LiveBagView tag={tag} />;
}
