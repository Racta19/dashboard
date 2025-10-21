import * as Sentry from "@sentry/react-router";
Sentry.init({
  dsn: "https://2fbf79ef17a3c285648b228e9b3abb8c@o4510224005595136.ingest.de.sentry.io/4510224008937552",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});