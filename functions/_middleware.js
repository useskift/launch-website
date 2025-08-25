import * as Sentry from "@sentry/cloudflare";

export const onRequest = [
  Sentry.sentryPagesPlugin((context) => ({
    dsn: "https://dde6dc3a09940e5fb15349c116018894@o4509508005134336.ingest.de.sentry.io/4509544307425360",
    tracesSampleRate: 0.1,
  })),
];
