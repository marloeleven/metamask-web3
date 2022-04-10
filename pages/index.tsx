import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Home from 'components/home';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function Web3App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Home />
    </Web3ReactProvider>
  );
}
