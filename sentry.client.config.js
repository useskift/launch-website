import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "",
  sendDefaultPii: true,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],

  _experiments: { enableLogs: true },

  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
