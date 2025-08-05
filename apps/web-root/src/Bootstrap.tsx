import "../sentry";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import auth from "@store/auth.store";
import * as Sentry from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const rootEl = document.getElementById("root");
const queryCLient = new QueryClient();

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
        <QueryClientProvider client={queryCLient}>
          <Provider store={auth}>
            <App />
          </Provider>
        </QueryClientProvider>
      </Sentry.ErrorBoundary>
    </React.StrictMode>,
  );
}
