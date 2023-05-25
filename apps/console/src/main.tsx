import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";

import App from "./app/app";
import { SENTRY_DSN_URL } from "./env";

if (SENTRY_DSN_URL) {
  const isDevelopment = process.env.NODE_ENV === "development";
  Sentry.init({
    dsn: SENTRY_DSN_URL,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    // Performance Monitoring
    tracesSampleRate: isDevelopment ? 1 : 0.25, // This sets the sample rate to 25% for all page loads in prod
    replaysSessionSampleRate: isDevelopment ? 1 : 0.1, // This sets the sample rate to 10% for all sessions in prod
    replaysOnErrorSampleRate: 1.0,
  });
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
