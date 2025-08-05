import * as Sentry from "@sentry/react";

const EXTRA_KEY = "ROUTE_TO";

const transport = Sentry.makeMultiplexedTransport(
  Sentry.makeFetchTransport,
  (args) => {
    const event = args.getEvent();
    if (
      event &&
      event.extra &&
      EXTRA_KEY in event.extra &&
      Array.isArray(event.extra[EXTRA_KEY])
    ) {
      return event.extra[EXTRA_KEY];
    }
    return [];
  },
);

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.httpClientIntegration(),
    Sentry.moduleMetadataIntegration(),
    Sentry.browserTracingIntegration(),
  ],
  sendDefaultPii: true,
  tracesSampleRate: 1,
  transport,
  beforeSend: (event) => {
    if (event?.exception?.values?.[0].stacktrace?.frames) {
      const frames = event.exception.values[0].stacktrace.frames;
      // Find the last frame with module metadata containing a DSN
      const routeTo = frames
        .filter((frame) => frame.module_metadata && frame.module_metadata.dsn)
        .map((v) => v.module_metadata)
        .slice(-1); // using top frame only - you may want to customize this according to your needs

      if (routeTo.length) {
        event.extra = {
          ...event.extra,
          [EXTRA_KEY]: routeTo,
        };
      }
    }
    return event;
  },
});
