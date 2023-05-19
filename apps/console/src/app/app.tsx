import { Navigate, Route, Routes } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";
import "antd/dist/reset.css";
import "./styles.css";

import { ThemeProvider } from "./lib/providers/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/graphql";
import { CurrentPromptProvider } from "./lib/providers/CurrentPromptContext";
import { PromptTesterProvider } from "./lib/providers/PromptTesterContext";
import { EnvironmentsPage } from "./pages/environments";
import { PromptsPage } from "./pages/prompts";
import { PromptPage } from "./pages/prompts/[promptId]";
import { APIKeysPage } from "./pages/api-keys";
import { SideNavigationLayout } from "./components/layout/SideNavigationLayout";

import { initSuperTokens } from "./lib/auth/supertokens";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { ThirdPartyEmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartyemailpassword/prebuiltui";
import { InfoPage } from "./pages/InfoPage";
import { EntryPoint } from "./pages/entrypoint";

initSuperTokens();

export function App() {
  return (
    <ThemeProvider>
      <main className="app">
        <SuperTokensWrapper>
          <QueryClientProvider client={queryClient}>
            <CurrentPromptProvider>
              <PromptTesterProvider>
                <Routes>
                  {/* We don't render the SideNavigationLayout for non-authorized routes */}
                  {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
                    ThirdPartyEmailPasswordPreBuiltUI,
                  ])}

                  {/* Authorized routes */}
                  <Route element={<SideNavigationLayout />}>
                    <Route index element={<EntryPoint />} />
                    <Route
                      path="/prompts"
                      element={
                        <SessionAuth>
                          <PromptsPage />
                        </SessionAuth>
                      }
                    />
                    <Route
                      path="/prompts/:promptId"
                      element={
                        <SessionAuth>
                          <PromptPage />
                        </SessionAuth>
                      }
                    />
                    <Route
                      path="/environments"
                      element={
                        <SessionAuth>
                          <EnvironmentsPage />
                        </SessionAuth>
                      }
                    />
                    <Route
                      path="/api-keys"
                      element={
                        <SessionAuth>
                          <APIKeysPage />
                        </SessionAuth>
                      }
                    />
                    <Route path="/info" element={<InfoPage />} />
                  </Route>
                </Routes>
              </PromptTesterProvider>
            </CurrentPromptProvider>
          </QueryClientProvider>
        </SuperTokensWrapper>
      </main>
    </ThemeProvider>
  );
}

export default App;
