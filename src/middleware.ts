import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const response = handleI18n(req);

  // On the bare root, next-intl redirects "/" -> "/{locale}" (the dashboard).
  // Send visitors to the welcome screen instead. This lives in the app — not in
  // netlify.toml — so the dev server and production behave identically.
  if (req.nextUrl.pathname === "/") {
    const location = response.headers.get("location");
    if (location) {
      const target = new URL(location, req.url);
      const locale = target.pathname.split("/")[1] || routing.defaultLocale;
      target.pathname = `/${locale}/welcome`;
      response.headers.set("location", target.toString());
    }
  }

  return response;
}

export const config = {
  // Match all paths except API, Next internals and files with an extension
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
