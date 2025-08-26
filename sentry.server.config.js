import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://30e19654baa2c41a091a45c5639a6325@o4509508005134336.ingest.de.sentry.io/4509555522142288",

  sendDefaultPii: true,
  enableLogs: true,
  tracesSampleRate: 0.5,
});
