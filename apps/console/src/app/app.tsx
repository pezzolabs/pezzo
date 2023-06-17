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
import { OrgPage } from "./pages/organizations/OrgPage";
import { AcceptInvitationPage } from "./pages/invitations/AcceptInvitationPage";
import { LogoutPage } from "./pages/LogoutPage";

initSuperTokens();

if (HOTJAR_SITE_ID && HOTJAR_VERSION) {
  hotjar.initialize(Number(HOTJAR_SITE_ID), Number(HOTJAR_VERSION));
}

// We need to define the paths this way for the
// breadcrumbs to work properly (useBreadcrumbItems)
export const paths = {
  "/logout": "/logout",
  "/projects": "/projects",
  "/invitations/:token/accept": "/invitations/:token/accept",
  "/onboarding": "/onboarding",
  "/info": "/info",
  "/orgs/:orgId": "/orgs/:orgId",
  "/projects/:projectId": "/projects/:projectId",
  "/projects/:projectId/prompts": "/projects/:projectId/prompts",
  "/projects/:projectId/prompts/:promptId":
    "/projects/:projectId/prompts/:promptId",
  "/projects/:projectId/environments": "/projects/:projectId/environments",
};

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

                <Route path={paths["/logout"]} element={<LogoutPage />} />
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
                    path={paths["/invitations/:token/accept"]}
                    element={
                      <LayoutWrapper
                        withSideNav={false}
                        withHeader={false}
                        withBreadcrumbs={false}
                      >
                        <AcceptInvitationPage />
                      </LayoutWrapper>
                    }
                  />

                  <Route
                    path={paths["/onboarding"]}
                    element={
                      <LayoutWrapper withSideNav={false}>
                        <OnboardingPage />
                      </LayoutWrapper>
                    }
                  />

                  <Route
                    path={paths["/info"]}
                    element={
                      <LayoutWrapper withSideNav={false}>
                        <InfoPage />
                      </LayoutWrapper>
                    }
                  />

                  {/* Organizations */}
                  <Route
                    path={paths["/orgs/:orgId"]}
                    element={
                      <LayoutWrapper withSideNav={false}>
                        <OrgPage />
                      </LayoutWrapper>
                    }
                  ></Route>

                  {/* Projects selection */}
                  <Route
                    element={
                      <LayoutWrapper withSideNav={false}>
                        <Outlet />
                      </LayoutWrapper>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to={paths["/projects"]} />}
                    />
                    <Route
                      path={paths["/projects"]}
                      element={<ProjectsPage />}
                    />
                  </Route>

                  {/* In-project routes */}
                  <Route
                    path={paths["/projects/:projectId"]}
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
                      path={paths["/projects/:projectId/prompts"]}
                      element={<PromptsPage />}
                    />
                    <Route
                      path={paths["/projects/:projectId/prompts/:promptId"]}
                      element={<PromptPage />}
                    />
                    <Route
                      path={paths["/projects/:projectId/environments"]}
                      element={<EnvironmentsPage />}
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
