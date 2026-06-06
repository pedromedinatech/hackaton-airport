import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Navigation, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getPlace, PLACES } from "@/data";
import { routing, type Locale } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { SaveButton } from "@/components/cards/SaveButton";
import ReserveButton from "@/components/detail/ReserveButton";
import { formatPrice, formatTime, hourLabel } from "@/lib/format";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PLACES.map((place) => ({ locale, id: place.id })),
  );
}

function InfoTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface border border-white/[0.06] p-3 text-center">
      <p className="flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

export default async function PlacePage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(locale);
  const place = getPlace(id);
  if (!place) notFound();

  const t = await getTranslations("Detail");
  const tt = await getTranslations("Types");
  const ti = await getTranslations("Interests");
  const loc = locale as Locale;
  const price = formatPrice(place.priceFrom, loc);
  const isVenue =
    place.opensHour !== undefined && place.closesHour !== undefined;
  const hours = isVenue
    ? `${hourLabel(place.opensHour as number)}–${hourLabel(place.closesHour as number)}`
    : place.startsAt
      ? formatTime(place.startsAt, loc)
      : "—";

  return (
    <div className="-mx-4 -mt-4">
      {/* Typographic hero — replaces gradient+emoji */}
      <div className="relative bg-surface border-b border-white/[0.06] px-4 pb-6 pt-16">
        <Link
          href="/"
          aria-label={t("back")}
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] text-ink-soft hover:bg-white/[0.10] transition"
        >
          <ArrowLeft size={18} aria-hidden />
        </Link>
        <SaveButton
          id={place.id}
          label={`${t("save")} · ${place.title}`}
          className="absolute right-4 top-4 h-10 w-10 bg-white/[0.06] hover:bg-white/[0.10] transition"
        />
        <Badge tone={place.type} className="mb-3">
          {tt(place.type)}
        </Badge>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink">
          {place.title}
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} aria-hidden /> {place.area}
          </span>
          {place.rating ? (
            <span className="inline-flex items-center gap-1">
              <Star size={13} aria-hidden className="fill-amber-400 text-amber-400" />
              {place.rating}
            </span>
          ) : null}
        </p>
      </div>

      <div className="space-y-5 px-4 py-5">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          {place.summary[loc]}
        </p>

        <section className="rounded-2xl bg-surface border border-white/[0.06] p-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-faint">
            {t("why")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {place.interests.map((interest) => (
              <Badge key={interest} tone="accent">
                {ti(interest)}
              </Badge>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <InfoTile label={t("price")} value={price ?? t("free")} />
          <InfoTile
            label={t("hours")}
            value={hours}
            icon={<Clock size={13} aria-hidden />}
          />
          <InfoTile
            label={t("distance")}
            value={`${place.distanceKm} km`}
            icon={<Navigation size={13} aria-hidden />}
          />
        </section>

        <div className="space-y-2">
          <ReserveButton />
          <Link
            href="/transport"
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-transparent text-sm font-semibold text-ink-soft hover:bg-white/[0.04] transition"
          >
            <Navigation size={16} aria-hidden /> {t("getThere")}
          </Link>
        </div>
      </div>
    </div>
  );
}
