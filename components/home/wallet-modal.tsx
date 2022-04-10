import { useMemo, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import CloseIcon from '@mui/icons-material/Close';

import { useHome } from './home-context';

import _get from 'lodash/get';
import { injected } from './hooks';

const LABEL = {
  accountId: 'Account',
  chainId: 'Chain Id',
  balance: 'Balance',
};

function formatValue(label: string, value: string | number) {
  if (label === 'accountId') {
    const account = value as string;

    return `${account.substring(0, 6)}...${account.substring(
      account.length - 6
    )}`;
  }

  if (label === 'balance') {
    return `Ξ ${value}`;
  }

  return value;
}

function WalletInformation({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-row border-b-[1px] py-2 text-gray-600">
      <Typography variant="caption" className="text-left font-bold">
        {_get(LABEL, label, label)}
      </Typography>
      <Typography variant="caption" className="flex-grow text-right">
        {formatValue(label, value)}
      </Typography>
    </div>
  );
}

function WalletDetails() {
  const { accountInformation } = useHome();
  const { deactivate } = useWeb3React();

  const arrayOfDetails = useMemo(
    () => Object.entries(accountInformation),
    [accountInformation]
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row border-b-[1px] pb-2 text-gray-600">
        <Typography
          variant="caption"
          className="text-left text-[9px] font-semibold"
        >
          KEY
        </Typography>
        <Typography
          variant="caption"
          className="flex-grow text-right text-[9px] font-semibold"
        >
          VALUE
        </Typography>
      </div>

      {arrayOfDetails.map(([label, value]) => (
        <WalletInformation key={label} label={label} value={value} />
      ))}

      <Typography variant="caption" className="my-6 text-center">
        Wallet Details
      </Typography>

      <Button
        variant="contained"
        color="error"
        className="-mx-5 bg-[color:var(--error)]"
        onClick={() => {
          deactivate();
        }}
      >
        Disconnect
      </Button>
    </div>
  );
}

function ConnectState({
  setIsLoading,
}: {
  setIsLoading: (state: boolean) => void;
}) {
  const { activate } = useWeb3React();
  const { setIsOpen } = useHome();

  return (
    <div className="flex flex-col">
      <Typography
        variant="body1"
        className="text-left text-[color:var(--error)]"
      >
        {`Wallet not conencted. Please click the "Connect Now" button below.`}
      </Typography>

      <Typography
        variant="body2"
        className="mt-4 border-l-4 border-solid border-[color:var(--primary)] pl-4 text-left text-xs text-gray-700"
      >
        {`Please complete wallet approval by opening your MetaMask extension`}
      </Typography>

      <div className="-mx-5 mt-6 flex flex-row">
        <Button
          variant="contained"
          color="info"
          className="mr-1 flex-grow bg-[color:var(--primary)]"
          onClick={async () => {
            setIsLoading(true);

            await activate(injected).catch((error) =>
              console.error('Authentication Error', error)
            );

            setIsLoading(false);
          }}
        >
          Connect Now
        </Button>

        <Button
          variant="contained"
          color="inherit"
          className="ml-1 flex-grow bg-[color:var(--neutral)] text-black"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function WalletModal() {
  const { isOpen, setIsOpen, isLoggedIn } = useHome();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="Wallet Details Modal"
      aria-describedby="Get wallet information and balance"
      className="flex items-center justify-center"
    >
      <Box className="relative w-[450px] rounded bg-white px-10 py-5">
        <div className="relative flex flex-row">
          <Typography
            variant="body1"
            className="-mx-4 mb-8 flex-grow font-bold"
          >
            Wallet Details
          </Typography>
          <IconButton
            className="absolute top-0 -right-4 p-0"
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon className="-scale-75 transition-transform duration-500 hover:rotate-[225deg]" />
          </IconButton>
        </div>
        {isLoggedIn && <WalletDetails />}
        {!isLoggedIn && <ConnectState setIsLoading={setIsLoading} />}

        <Backdrop
          className="flex h-full items-center justify-center"
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
