import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

import Fundraiser from '../../../artifacts/contracts/Fundraiser.sol/Fundraiser.json';

// Define an interface for the context value
interface Web3ContextValue {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
}

// Create the Web3 context
const Web3Context = createContext<Web3ContextValue | undefined>(undefined);

export const useWeb3 = (): Web3ContextValue => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        const web3Signer = await web3Provider.getSigner();
        setSigner(web3Signer);

        const contractAddress = process.env.FUNDRAISER_CONTRACT_ADDRESS; // Use the address from .env
        const fundraiserContract = new ethers.Contract(contractAddress as string, Fundraiser.abi, web3Signer);
        setContract(fundraiserContract);
      }
    };

    init();
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, contract }}>
      {children}
    </Web3Context.Provider>
  )
}