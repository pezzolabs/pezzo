import "antd/dist/reset.css";
import "./styles.css";

import { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "../providers/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/graphql";
import { SideNavigation } from "../components/layout/SideNavigation";
import { Layout } from "antd";
import styled from "@emotion/styled";
import { CurrentPromptProvider } from "../lib/providers/CurrentPromptContext";
import { PromptTesterProvider } from "../lib/providers/PromptTesterContext";

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

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <title>Pezzo | Prompts </title>
      </Head>
      <main className="app">
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <CurrentPromptProvider>
              <PromptTesterProvider>
                <Layout style={{ height: "100vh", maxHeight: "100vh" }}>
                  {/* <TopNavigation /> */}
                  <Layout>
                    <SideNavigation />
                    <StyledContent>
                      <Component />
                    </StyledContent>
                  </Layout>
                </Layout>
              </PromptTesterProvider>
            </CurrentPromptProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </main>
    </>
  );
}

export default CustomApp;
