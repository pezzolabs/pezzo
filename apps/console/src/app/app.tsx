import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { hotjar } from "react-hotjar";
import "./styles.css";
import "./antd-overrides.css";

import { ThemeProvider } from "./lib/providers/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/graphql";
import { CurrentPromptProvider } from "./lib/providers/CurrentPromptContext";
import { EnvironmentsPage } from "./pages/environments/EnvironmentsPage";
import { PromptsPage } from "./pages/prompts/PromptsPage";
import { PromptPage } from "./pages/prompts/PromptPage";
import { initSuperTokens } from "./lib/auth/supertokens";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { InfoPage } from "./pages/InfoPage";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { LayoutWrapper } from "./components/layout/LayoutWrapper";
import { OnboardingPage } from "./pages/organizations/onboarding";
import { AuthProvider } from "./lib/providers/AuthProvider";
import { OptionalIntercomProvider } from "./lib/providers/OptionalIntercomProvider";
import { HOTJAR_SITE_ID, HOTJAR_VERSION } from "../env";
import { OrgPage } from "./pages/organizations/OrgPage";
import { AcceptInvitationPage } from "./pages/invitations/AcceptInvitationPage";
import { LogoutPage } from "./pages/auth/LogoutPage";
import { RequestsPage } from "./pages/requests/RequestsPage";
import { DashboardPage } from "./pages/projects/overview/DashboardPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { AuthCallbackPage } from "./pages/auth/AuthCallbackPage";

initSuperTokens();

if (HOTJAR_SITE_ID && HOTJAR_VERSION) {
  hotjar.initialize(Number(HOTJAR_SITE_ID), Number(HOTJAR_VERSION));
}

// We need to define the paths this way for the
// breadcrumbs to work properly (useBreadcrumbItems)
export const paths = {
  "/login": "/login",
  "/login/callback/:providerId": "/login/callback/:providerId",
  "/logout": "/logout",
  "/projects": "/projects",
  "/invitations/:token/accept": "/invitations/:token/accept",
  "/onboarding": "/onboarding",
  "/info": "/info",
  "/orgs/:orgId": "/orgs/:orgId",
  "/projects/:projectId": "/projects/:projectId",
  "/projects/:projectId/dashboard": "/projects/:projectId/dashboard",
  "/projects/:projectId/requests": "/projects/:projectId/reqeusts",
  "/projects/:projectId/prompts": "/projects/:projectId/prompts",
  "/projects/:projectId/prompts/:promptId":
    "/projects/:projectId/prompts/:promptId",
  "/projects/:projectId/environments": "/projects/:projectId/environments",
};

export function App() {
  return (
    <ThemeProvider>
      <main className="app flex h-full min-h-full flex-1 overflow-hidden bg-neutral-900 text-slate-300">
        <SuperTokensWrapper>
          <QueryClientProvider client={queryClient}>
            {/* Non-authorized routes */}
            <Routes>
              {/* We don't render the LayoutWrapper for non-authorized routes */}
              <Route
                path={paths["/login/callback/:providerId"]}
                element={<AuthCallbackPage />}
              />
              <Route path={paths["/login"]} element={<LoginPage />} />
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
                  <Route index element={<Navigate to={paths["/projects"]} />} />
                  <Route path={paths["/projects"]} element={<ProjectsPage />} />
                </Route>

                {/* In-project routes */}
                <Route
                  path={paths["/projects/:projectId"]}
                  element={
                    <CurrentPromptProvider>
                      <LayoutWrapper withSideNav={true}>
                        <Outlet />
                      </LayoutWrapper>
                    </CurrentPromptProvider>
                  }
                >
                  <Route
                    index
                    path={paths["/projects/:projectId/"]}
                    element={<DashboardPage />}
                  />
                  <Route
                    path={"/projects/:projectId/dashboard"}
                    element={<DashboardPage />}
                  />
                  <Route
                    path={"/projects/:projectId/requests"}
                    element={<RequestsPage />}
                  />
                  <Route
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
        </SuperTokensWrapper>
      </main>
    </ThemeProvider>
  );
}

export default App;
