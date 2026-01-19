'use client';

import { TonConnectUIProvider } from "@tonconnect/ui-react";

interface TonConnectProviderProps {
  children: React.ReactNode;
  manifestUrl: string;
}

export function TonConnectProvider({ children, manifestUrl }: TonConnectProviderProps) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
