import type { AppProps } from "next/app";
import Head from "next/head";
import "../src/index.css";

export default function NextApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
