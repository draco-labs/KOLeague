import { createContext, useContext, useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useProvider,
} from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";
import toast from "react-hot-toast";


const storeContext = createContext(null);

export const useContextStore = () => useContext(storeContext);

const ContextStoreProvider = ({ children }) => {
  const [closeTweet, setCloseTweet] = useState({});
  const [mobileMode, setMobileMode] = useState(false);
  const [height, setHeight] = useState();
  const { disconnect } = useDisconnect();
  const {isConnected, address} = useAccount();

  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors 
  });

  const connectWallet = async () => {
   
      const { connector } = await starknetkitConnectModal();
    connect({ connector });
    
  };


    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setMobileMode(true);
        } else {
          setMobileMode(false);
        }
      };
      setHeight(window.innerHeight);
  
      window.addEventListener("resize", handleResize);
  
      handleResize();
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

  return (
    <storeContext.Provider value={{ closeTweet, setCloseTweet,height, mobileMode, connectWallet, disconnect, isConnected, address }}>
      {children}
    </storeContext.Provider>
  );
};

export default ContextStoreProvider;