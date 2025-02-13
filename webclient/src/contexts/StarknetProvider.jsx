'use client';

import React, { useMemo } from 'react';
import { ArgentMobileConnector } from 'starknetkit/argentMobile';
import { WebWalletConnector } from 'starknetkit/webwallet';
import {
  StarknetConfig,
  braavos,
  
  argent,
  jsonRpcProvider,
} from '@starknet-react/core';
import { mainnet } from '@starknet-react/chains';

export function StarknetProvider({ children }) {
  // const provider = publicProvider();

  const connectors = useMemo(() => {
    return [
      braavos(),
      argent(),
      new WebWalletConnector({ url: 'https://web.argent.xyz' }),
      new ArgentMobileConnector(),
    ];
  }, []);

  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={jsonRpcProvider({
        rpc: () => ({
          nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
        }),
      })}
      connectors={connectors}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
