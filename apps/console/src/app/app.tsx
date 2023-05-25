import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";
import { hotjar } from "react-hotjar";
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
import { initSuperTokens } from "./lib/auth/supertokens";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { ThirdPartyEmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartyemailpassword/prebuiltui";
import { InfoPage } from "./pages/InfoPage";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { LayoutWrapper } from "./components/layout/LayoutWrapper";
import { OnboardingPage } from "./pages/onboarding";
import { AuthProvider } from "./lib/providers/AuthProvider";
import { ThirdpartyEmailPasswordComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import LogoSquare from "../assets/logo.svg";
import { OptionalIntercomProvider } from "./lib/providers/OptionalIntercomProvider";
import { HOTJAR_SITE_ID, HOTJAR_VERSION } from "../env";

initSuperTokens();

if (HOTJAR_SITE_ID && HOTJAR_VERSION) {
  hotjar.initialize(Number(HOTJAR_SITE_ID), Number(HOTJAR_VERSION));
}

export function App() {
  return (
    <ThemeProvider>
      <main className="app">
        <SuperTokensWrapper>
          <ThirdpartyEmailPasswordComponentsOverrideProvider
            components={{
              ThirdPartyEmailPasswordHeader_Override: ({
                DefaultComponent,
                ...props
              }) => {
                return (
                  <div>
                    <img
                      src={LogoSquare}
                      alt="Logo"
                      style={{
                        height: 60,
                        marginBottom: 24,
                      }}
                    />
                    <DefaultComponent {...props} />
                  </div>
                );
              },
            }}
          >
            <QueryClientProvider client={queryClient}>
              {/* Non-authorized routes */}
              <Routes>
                {/* We don't render the LayoutWrapper for non-authorized routes */}
                {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
                  ThirdPartyEmailPasswordPreBuiltUI,
                ])}
              </Routes>
              {/* Authorized routes */}
              <Routes>
                <Route
                  element={
                    <SessionAuth>
                      <AuthProvider>
                        <OptionalIntercomProvider>
                          <Outlet />
                        </OptionalIntercomProvider>
                      </AuthProvider>
                    </SessionAuth>
                  }
                >
                  <Route
                    path="/onboarding"
                    element={
                      <LayoutWrapper withSideNav={false}>
                        <OnboardingPage />
                      </LayoutWrapper>
                    }
                  />

                  <Route
                    path="/info"
                    element={
                      <LayoutWrapper withSideNav={false}>
                        <InfoPage />
                      </LayoutWrapper>
                    }
                  />

                  {/* Projects selection */}
                  <Route
                    element={
                      <LayoutWrapper withSideNav={false}>
                        <Outlet />
                      </LayoutWrapper>
                    }
                  >
                    <Route index element={<Navigate to="/projects" />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                  </Route>

                  {/* In-project routes */}
                  <Route
                    path="/projects/:projectId"
                    element={
                      <CurrentPromptProvider>
                        <PromptTesterProvider>
                          <LayoutWrapper withSideNav={true}>
                            <Outlet />
                          </LayoutWrapper>
                        </PromptTesterProvider>
                      </CurrentPromptProvider>
                    }
                  >
                    <Route
                      index
                      path="/projects/:projectId/prompts"
                      element={<PromptsPage />}
                    />
                    <Route
                      path="/projects/:projectId/prompts/:promptId"
                      element={<PromptPage />}
                    />
                    <Route
                      path="/projects/:projectId/environments"
                      element={<EnvironmentsPage />}
                    />
                    <Route
                      path="/projects/:projectId/provider-api-keys"
                      element={<APIKeysPage />}
                    />
                  </Route>
                </Route>
              </Routes>
            </QueryClientProvider>
          </ThirdpartyEmailPasswordComponentsOverrideProvider>
        </SuperTokensWrapper>
      </main>
    </ThemeProvider>
  );
}

export default App;
