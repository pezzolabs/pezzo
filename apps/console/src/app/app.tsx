import styled from "@emotion/styled";
import { Navigate, Route, Routes } from "react-router-dom";
import "antd/dist/reset.css";
import "./styles.css";

import { ThemeProvider } from "./lib/providers/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/graphql";
import { SideNavigation } from "./components/layout/SideNavigation";
import { Layout } from "antd";
import { CurrentPromptProvider } from "./lib/providers/CurrentPromptContext";
import { PromptTesterProvider } from "./lib/providers/PromptTesterContext";
import { EnvironmentsPage } from "./pages/environments";
import { PromptsPage } from "./pages/prompts";
import { PromptPage } from "./pages/prompts/[promptId]";

const { Content } = Layout;

const StyledContent = styled(Content)`
  padding: 22px;
  min-height: 200px;
  overflow-y: auto;

  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  ::-ms-scrollbar {
    display: none; /* IE */
  }
`;

export function App() {
  return (
    <>
      <main className="app">
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <CurrentPromptProvider>
              <PromptTesterProvider>
                <Layout style={{ height: "100vh", maxHeight: "100vh" }}>
                  <Layout>
                    <SideNavigation />
                    <StyledContent>
                      <Routes>
                        <Route index element={<Navigate to="/prompts" />} />
                        <Route path="/prompts" element={<PromptsPage />} />
                        <Route path="/prompts/:promptId" element={<PromptPage />} />
                        <Route
                          path="/environments"
                          element={<EnvironmentsPage />}
                        />
                      </Routes>
                    </StyledContent>
                  </Layout>
                </Layout>
              </PromptTesterProvider>
            </CurrentPromptProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </main>
    </>
    // <StyledApp>
    //   <NxWelcome title="console" />

    //   {/* START: routes */}
    //   {/* These routes and navigation have been generated for you */}
    //   {/* Feel free to move and update them to fit your needs */}
    //   <br />
    //   <hr />
    //   <br />
    //   <div role="navigation">
    //     <ul>
    //       <li>
    //         <Link to="/">Home</Link>
    //       </li>
    //       <li>
    //         <Link to="/page-2">Page 2</Link>
    //       </li>
    //     </ul>
    //   </div>

    //   {/* END: routes */}
    // </StyledApp>
  );
}

export default App;
