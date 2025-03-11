import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const socket = useSocket();

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} socket={socket} />
    </QueryClientProvider>
  );
}
