// import '@/styles/globals.css'
import type { AppProps } from "next/app";
import Head from "next/head";
import { NextPage } from "next";
import { ComponentType, ReactElement, ReactNode, useMemo } from "react";
import { queryClient } from "@/utils/QueryClient";
import { QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material";

import getDesignTheme from "@/components/theme/getDesignTheme";
import { ThemeOptions } from "@mui/material/styles";

type Page<P = {}> = NextPage<P> & {
  // You can disable whichever you don't need
  getLayout?: (page: ReactElement) => ReactNode;
  layout?: ComponentType;
};
type Props = AppProps & {
  Component: Page;
  // dehydrateState: any;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: Props) {
  const theme = useMemo(
    () =>
      responsiveFontSizes(createTheme(getDesignTheme("light") as ThemeOptions)),
    []
  );
  return (
    <>
      <Head>
        <meta name="application-name" content="PWA App" />
        <meta name="theme-color" content="#999999" />
        {/* <meta name="theme-color" content="#4285f4" />
        <meta name="msapplication-navbutton-color" content="#4285f4" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#4285f4" /> */}
        <meta name="view-transition" content="same-origin" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        ></meta>
      </Head>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div
              style={{
                maxWidth: "100vw",
                backgroundColor: "rgb(243, 242, 239)",
              }}
            >
              <Component {...pageProps} />
            </div>
          </ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
