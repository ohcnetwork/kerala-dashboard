import { Windmill } from "@windmill/react-ui";
import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React from "react";

import Sidebar from "../components/Sidebar";
import myTheme from "../lib/theme";

import "../styles/index.css";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Windmill usePreferences theme={myTheme}>
      <div>
        <Head>
          <meta
            name="description"
            content="A detailed dashboard for current Kerala COVID-19 stats."
          />
          <link
            rel="icon"
            href="https://cdn.coronasafe.network/care-manifest/images/icons/icon-192x192.png"
          />
        </Head>

        <Sidebar />
        <main className="bg-gray-50 dark:bg-gray-900 flex justify-center min-h-screen dark:text-gray-200">
          <Component {...pageProps} />
        </main>
      </div>
    </Windmill>
  );
}
