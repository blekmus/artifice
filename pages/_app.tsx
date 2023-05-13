import React from "react"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Josefin_Sans } from "next/font/google"
import { Provider } from "jotai"
import { SessionProvider } from "next-auth/react"
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

const josefin = Josefin_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
})

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={session}>
          <Provider>
            <style jsx global>{`
              html {
                font-family: ${josefin.style.fontFamily};
                background-color: #0e1011;
              }
            `}</style>
            <Component {...pageProps} />
          </Provider>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}
