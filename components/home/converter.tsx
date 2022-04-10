import { MouseEvent, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import CachedIcon from '@mui/icons-material/Cached';

import clsx from 'clsx';

import { useHome } from './home-context';

const converter = {
  nepToBusd: (nep: string) => (Number(nep) * 3).toFixed(2),
  busdToNep: (busd: string) => (Number(busd) / 3).toFixed(2),
};

const onClickSelect = (event: MouseEvent<HTMLInputElement>) =>
  (event.target as HTMLInputElement).select();

function ConnectionStatus() {
  const { active, error } = useWeb3React();

  console.log(error);
  return (
    <div
      className={clsx('absolute right-4 top-2 h-4 w-4 rounded shadow-md', {
        'bg-[color:var(--primary)]': active,
        'bg-[color:var(--neutral-status)]': !active && !error,
        'bg-[color:var(--error)]': !!error,
      })}
    ></div>
  );
}

export default function Converter() {
  const { setIsOpen } = useHome();

  const [nep, setNep] = useState('');
  const [busd, setBusd] = useState('');

  return (
    <Card className="relative flex flex-col py-5 px-10">
      <ConnectionStatus />
      <div className="my-2 flex flex-col">
        <Typography variant="h6" className="mb-4 font-bold">
          Crypto converter
        </Typography>
        <TextField
          label="NEP"
          variant="outlined"
          type="number"
          placeholder="0.00"
          value={nep}
          onClick={onClickSelect}
          onChange={(event) => {
            const nepValue = event.target.value;

            setNep(nepValue);
            setBusd(converter.nepToBusd(nepValue));
          }}
        />
        <CachedIcon className="my-4 mx-auto" />
        <TextField
          label="BUSD"
          variant="outlined"
          type="number"
          placeholder="0.00"
          value={busd}
          onClick={onClickSelect}
          onChange={(event) => {
            const busdValue = event.target.value;

            setBusd(busdValue);
            setNep(converter.busdToNep(busdValue));
          }}
        />
      </div>
      <div className="text-center">
        <Button
          className="mt-4 cursor-pointer rounded px-2 font-bold normal-case text-blue-500 hover:text-blue-400"
          onClick={() => setIsOpen(true)}
        >
          Check Wallet Details
        </Button>
      </div>
    </Card>
  );
}
