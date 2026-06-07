import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import type { BrandButton, TransportOption } from "@/features/transport/types";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";

function BrandBtn({
  btn,
  className = "",
  coverLogo = false,
}: {
  btn: BrandButton;
  className?: string;
  coverLogo?: boolean;
}) {
  const external = btn.href.startsWith("http");
  return (
    <a
      href={btn.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`flex items-center justify-center rounded-xl border border-white/20 ${coverLogo ? "h-14 px-4 py-2" : "py-3 overflow-hidden"} ${className}`}
      style={{ backgroundColor: btn.bg }}
      aria-label={btn.label}
    >
      {btn.logoSrc ? (
        coverLogo ? (
          <div className="relative h-full w-full">
            <Image
              src={btn.logoSrc}
              alt={btn.label}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <Image
            src={btn.logoSrc}
            alt={btn.label}
            width={80}
            height={28}
            className="h-7 w-auto object-contain"
            unoptimized
          />
        )

      ) : (
        <span className="text-sm font-bold" style={{ color: btn.fg }}>
          {btn.label}
        </span>
      )}
    </a>
  );
}

export function TransportCard({ option }: { option: TransportOption }) {
  const t = useTranslations("Transport");
  const tm = useTranslations("Transport.modes");
  const locale = useLocale() as Locale;
  const price = formatPrice(option.priceFrom, locale);

  const title = option.title ? option.title[locale] : tm(option.mode);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.06] bg-surface">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {option.hideIcon ? null : (
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl overflow-hidden bg-white/[0.06]"
            aria-hidden
          >
            {option.emojiSrc ? (
              <Image
                src={option.emojiSrc}
                alt=""
                width={40}
                height={40}
                className="h-9 w-9 object-contain"
                unoptimized
              />
            ) : (
              <span className="text-2xl">{option.emoji}</span>
            )}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-ink">{title}</h3>
            {option.badge ? <Badge tone="accent">{option.badge}</Badge> : null}
          </div>
          <p className="text-xs text-ink-faint">
            {option.etaMin} {t("min")} ·{" "}
            {price ? `${t("from")} ${price}` : t("free")}
          </p>
        </div>
      </div>

      {/* Rideshare: two big app buttons */}
      {option.layout === "buttons" && option.buttons?.length ? (
        <div className="border-t border-white/[0.06] px-4 py-3 flex gap-3">
          {option.buttons.map((btn) => (
            <BrandBtn key={btn.label} btn={btn} className="flex-1" coverLogo={!!btn.logoSrc} />
          ))}
        </div>
      ) : null}

      {/* Car rental: title + logo grid */}
      {option.layout === "logos" && option.logos?.length ? (
        <div className="border-t border-white/[0.06] px-4 py-4">
          <p className="mb-3 text-xs text-ink-soft leading-snug">
            {t("rentalTitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {option.logos.map((logo) => (
              <BrandBtn
                key={logo.label}
                btn={logo}
                className="w-[calc((100%-1rem)/3)]"
                coverLogo={!!logo.logoSrc}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Default / Bus: numbered steps */}
      {(!option.layout || option.layout === "default" || option.layout === "bus") &&
      option.steps[locale].length > 0 ? (
        <div className="border-t border-white/[0.06] px-4 py-3">
          <ol className="space-y-1.5">
            {option.steps[locale].map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-soft">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/[0.12] text-[11px] font-bold text-accent">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          {/* Bus: 24pay app button */}
          {option.layout === "bus" && option.appButton ? (
            <BrandBtn
              btn={option.appButton}
              className="mt-3 w-full"
              coverLogo={!!option.appButton.logoSrc}
            />
          ) : null}

          {option.note ? (
            <p className="mt-2.5 text-xs italic text-ink-faint">
              {option.note[locale]}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
