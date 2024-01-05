import "./styles.css";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { hotjar } from "react-hotjar";
import { HOTJAR_SITE_ID, HOTJAR_VERSION } from "~/env";
import { Toaster } from "@pezzo/ui";

// Auth
import { QueryClientProvider } from "@tanstack/react-query";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { initSuperTokens } from "./lib/auth/supertokens";

// Pages
import { EnvironmentsPage } from "./pages/environments/EnvironmentsPage";
import { PromptPage } from "./pages/prompts/PromptPage";
import { PromptsPage } from "./pages/prompts/PromptsPage";
import { OnboardingPage } from "./pages/organizations/onboarding";
import { LogoutPage } from "./pages/auth/LogoutPage";
import { RequestsPage } from "./pages/requests/RequestsPage";
import { DashboardPage } from "./pages/projects/overview/DashboardPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { AuthCallbackPage } from "./pages/auth/AuthCallbackPage";
import { queryClient } from "./lib/graphql";
import { AuthProvider } from "./lib/providers/AuthProvider";
import { OptionalIntercomProvider } from "./lib/providers/OptionalIntercomProvider";
import { LayoutWrapper } from "./components/layout/LayoutWrapper";
import { AcceptInvitationPage } from "./pages/invitations/AcceptInvitationPage";
import { CurrentPromptProvider } from "./lib/providers/CurrentPromptContext";
import { RequiredProviderApiKeyModalProvider } from "./lib/providers/RequiredProviderApiKeyModalProvider";
import { OrgMembersPage } from "./pages/organizations/OrgMembersPage";
import { OrgSettingsPage } from "./pages/organizations/OrgSettingsPage";
import { OrgApiKeysPage } from "./pages/organizations/OrgApiKeysPage";
import { PromptEditView } from "./features/editor/PromptEditView";
import { EditorProvider } from "./lib/providers/EditorContext";
import { PromptTesterProvider } from "./lib/providers/PromptTesterContext";
import { PromptVersionsView } from "./components/prompts/views/PromptVersionsView";
import { Suspense } from "react";
import { FullScreenLoader } from "./components/common/FullScreenLoader";
import { OrgPage } from "./pages/projects/OrgPage";
import { useCurrentOrganization } from "./lib/hooks/useCurrentOrganization";
import { WaitlistWrapper } from "~/pages/WaitlistWrapper";

initSuperTokens();

if (HOTJAR_SITE_ID && HOTJAR_VERSION) {
  hotjar.initialize(Number(HOTJAR_SITE_ID), Number(HOTJAR_VERSION));
}

const RootHandler = () => {
  const { organizationId, isLoading } = useCurrentOrganization();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (organizationId) {
    return <Navigate to={`/orgs/${organizationId}`} />;
  }
};

export function App() {
  return (
    <div className="relative h-full">
      <Toaster />
      <SuperTokensWrapper>
        <QueryClientProvider client={queryClient}>
          {/* Non-authorized routes */}
          <Routes>
            {/* We don't render the LayoutWrapper for non-authorized routes */}
            <Route
              path="/login/callback/:providerId"
              element={<AuthCallbackPage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
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
              <Route index element={<RootHandler />} />

              <Route
                path="/invitations/:token/accept"
                element={
                  <LayoutWrapper withSideNav={false}>
                    <AcceptInvitationPage />
                  </LayoutWrapper>
                }
              />

              <Route
                path="/onboarding"
                element={
                  <LayoutWrapper withSideNav={false}>
                    <WaitlistWrapper>
                      <OnboardingPage />
                    </WaitlistWrapper>
                  </LayoutWrapper>
                }
              />

              {/* Organizations */}
              <Route
                path="/orgs/:orgId"
                element={
                  <LayoutWrapper withSideNav={false} withOrgSubHeader={true}>
                    <Suspense fallback={<FullScreenLoader />}>
                      <WaitlistWrapper>
                        <Outlet />
                      </WaitlistWrapper>
                    </Suspense>
                  </LayoutWrapper>
                }
              >
                <Route index element={<OrgPage />} />
                <Route path="members" element={<OrgMembersPage />} />
                <Route path="api-keys" element={<OrgApiKeysPage />} />
                <Route path="settings" element={<OrgSettingsPage />} />
              </Route>

              {/* In-project routes */}
              <Route
                path="/projects/:projectId"
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <CurrentPromptProvider>
                      <RequiredProviderApiKeyModalProvider>
                        <LayoutWrapper withSideNav={true}>
                          <WaitlistWrapper>
                            <Outlet />
                          </WaitlistWrapper>
                        </LayoutWrapper>
                      </RequiredProviderApiKeyModalProvider>
                    </CurrentPromptProvider>
                  </Suspense>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="environments" element={<EnvironmentsPage />} />
                <Route path={"dashboard"} element={<DashboardPage />} />
                <Route path={"requests"} element={<RequestsPage />} />
                <Route path="prompts" element={<PromptsPage />} />
                <Route path="prompts/:promptId" element={<PromptPage />}>
                  <Route index element={<Navigate to="edit" />} />
                  <Route
                    index
                    path="edit"
                    element={
                      <EditorProvider>
                        <PromptTesterProvider>
                          <PromptEditView />
                        </PromptTesterProvider>
                      </EditorProvider>
                    }
                  />
                  <Route path="versions" element={<PromptVersionsView />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </QueryClientProvider>
      </SuperTokensWrapper>
    </div>
  );
}

export default App;
