import { createContext, useContext } from 'react';
import noop from 'lodash/noop';

export const HomeContext = createContext<{
  isLoggedIn: boolean;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  accountInformation: {
    accountId: string;
    chainId: number;
    balance: number;
  };
}>({
  isLoggedIn: false,
  isOpen: false,
  setIsOpen: noop,
  accountInformation: {
    accountId: '',
    chainId: 97,
    balance: 0,
  },
});

export const useHome = () => useContext(HomeContext);
