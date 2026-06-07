import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    // Each new deploy's service worker activates immediately and takes over open
    // pages, so returning visitors get the fresh build instead of a stale cache.
    skipWaiting: true,
    clientsClaim: true,
  },
});

// Static export is opt-in. The AI Assistant needs a server-side API route
// (/api/chat) to keep the Anthropic key off the client, and a static export has
// no server runtime to serve it. Default to a normal (server-capable) build;
// set STATIC_EXPORT=true only for a static-only deploy (the chatbot won't work).
const isExport = process.env.STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isExport ? { output: "export", trailingSlash: true } : {}),
};

export default withPWA(withNextIntl(nextConfig));
