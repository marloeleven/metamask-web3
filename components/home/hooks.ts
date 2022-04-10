import { useEffect } from 'react';

import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';

import { toast } from 'react-toastify';

import _get from 'lodash/get';

export const injected = new InjectedConnector({
  supportedChainIds: [97],
});

export function useEagerConnect() {
  const { activate } = useWeb3React();

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true);
      }
    });
    // eslint-disable-next-line
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  return;
}

enum ERROR_CODES {
  PENDING_WALLET_APPROVAL = -32002,
}
export function useErrorListener() {
  const { error } = useWeb3React();

  useEffect(() => {
    if (error) {
      const code = _get(error, 'code', '');

      if (code === ERROR_CODES.PENDING_WALLET_APPROVAL) {
        toast(
          'There is a pending wallet approval of which you need to complete by opening your MetaMask extension',
          { type: 'info', toastId: 'PENDING_WALLET_APPROVAL' }
        );

        return;
      }

      toast(error.message, { type: 'error', toastId: code });
    }
  }, [error]);
}
