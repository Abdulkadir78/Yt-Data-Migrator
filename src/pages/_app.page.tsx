import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Yt data migrator</title>
        <meta
          name="description"
          content="Transfer your subscriptions and playlists from one youtube account to another"
        />
      </Head>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
    </>
  );
}
