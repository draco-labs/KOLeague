import "@/styles/globals.css";

import { Toaster } from "react-hot-toast";
import { DefaultSeo } from "next-seo";
import Layout from "@/layouts";
import GlobalProvider from "@/contexts/GlobalProvider";
import ContextStoreProvider  from "@/contexts";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StarknetProvider } from "@/contexts/StarknetProvider";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const color = {
    primary: "#F0E4CF",
    secondary: "#0E1921",
    secondaryLight: "#1A2B37",
    black: "#0A0A0B",
    white: "#F8F7FF",
    whiteShade: "#A8ABB4",
    bg: "#0A141B",
  }

  const Hex2Rgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const queryClient = new QueryClient();

  return <>
    <DefaultSeo
      defaultTitle={"KOLeague"}
      title={"KOLeague"}
      description={"KOLeague - Discover the ultimate Bitcoin Price Prediction project designed to analyze and forecast cryptocurrency trends with advanced machine learning algorithms. Gain insights into market movements, identify profitable opportunities, and make informed trading decisions. Whether you're a seasoned investor or just entering the crypto space, our predictive models leverage real-time data and historical patterns to give you a competitive edge. Stay ahead in the volatile Bitcoin market with accurate and reliable price predictions. Explore our solution today for smarter cryptocurrency investments!"}
      canonical={`https://domain.com/`}
      robotsProps={{
        noarchive: true,
      }}
      openGraph={{
        site_name: "KOLeague",
        title: "KOLeague",
        description: "KOLeague",
        url: `https://domain.com/`,
        images: [
          {
            url: '/logo.png',
            alt: 'KOLeague',
          },
        ],
      }}
      additionalMetaTags={[
        {
          name: "keywords",
          content: "KOLeague, Bitcoin, Predict, BTC, Market Sector",
        },
      ]}
    />
    <Toaster
      reverseOrder={false}
      toastOptions={{
        className: "toast-nek",
        style: {
          border: "1px solid #27272A",
          padding: "20px 22px 20px 20px",
          borderRadius: "6px",
          margin: 0,
          maxWidth: "400px",

        },
      }}
    />
    <TransitionGroup component={null}>
      <CSSTransition
        key={router.route}
        classNames={{
          enter: 'page-enter',
          exit: 'page-exit',
        }}
        timeout={500}
      >
      <QueryClientProvider client={queryClient}>
        <GlobalProvider {...pageProps}>
          <StarknetProvider>
          <ContextStoreProvider>
          <Layout>
            <Component {...pageProps} />

          </Layout>
          </ContextStoreProvider>
          </StarknetProvider>
        </GlobalProvider>
        </QueryClientProvider>
      </CSSTransition>
    </TransitionGroup>
  </>;
}
