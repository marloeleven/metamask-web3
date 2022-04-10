import React, { useEffect, useState } from 'react';

import type { NextPage } from 'next';
import Image from 'next/image';

import { useWeb3React } from '@web3-react/core';
import { formatEther } from '@ethersproject/units';
import type { BigNumberish } from '@ethersproject/bignumber';

import produce from 'immer';

import { ToastContainer } from 'react-toastify';
import Typography from '@mui/material/Typography';

import { HomeContext } from './home-context';
import Converter from './converter';
import WalletModal from './wallet-modal';
import { useEagerConnect, useErrorListener } from './hooks';

import 'react-toastify/dist/ReactToastify.css';

const Home: NextPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [accountInformation, setAccountInformation] = useState({
    accountId: '',
    chainId: 97,
    balance: 0,
  });

  const { library, chainId, account, active } = useWeb3React();

  useEagerConnect();
  useErrorListener();

  useEffect(() => {
    if (active) {
      setIsLoggedIn(true);
      return;
    }

    setIsLoggedIn(false);
    setAccountInformation(
      produce((accountInformation) => ({
        ...accountInformation,
        accountId: '',
        balance: 0,
      }))
    );
  }, [active]);

  useEffect(() => {
    if (active && account && library) {
      library.getBalance(account).then((balance: BigNumberish) => {
        setAccountInformation(
          produce((accountInformation) =>
            Object.assign(accountInformation, {
              accountId: account,
              chainId,
              balance: formatEther(balance),
            })
          )
        );
      });

      return;
    }
  }, [active, chainId, account, library]);

  return (
    <HomeContext.Provider
      value={{
        isLoggedIn,
        isOpen,
        setIsOpen,
        accountInformation,
      }}
    >
      <main className="flex h-full flex-col items-center justify-center bg-slate-900">
        <Header />
        <Converter />
        <WalletModal />
        <ToastContainer />
      </main>
    </HomeContext.Provider>
  );
};

export default React.memo(Home);

function Header() {
  return (
    <div className="mb-8 flex items-center text-white">
      <Image src="/neptune.png" alt="Neptune Logo" width={100} height={100} />
      <Typography variant="h4" className="ml-4">
        NEPTUNE MUTUAL
      </Typography>
    </div>
  );
}
