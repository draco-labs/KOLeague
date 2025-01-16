/* eslint-disable no-unused-vars */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// import userSevice from "@/services/user.service";
import marketService from "@/services/market.service";
import { ethers } from "ethers";
import { provider } from "@/utils/contract";
import { WALLET_PRIVATE_KEY_PASSWORD } from "@/utils/constants";
import { decrypt } from "@/utils/encrypt";

export const GlobalContext = createContext({});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({
  children,
  globalData,
  locale,
  locales,
}) => {

  const [domain, setDomain] = useState("");
  const [activeChain, setActiveChain] = useState(null);
  const [profile, setProfile] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSetting, setShowSetting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showEncrypt, setShowEncrypt] = useState(false)
  const [action, setAction] = useState(null)
  const [showModalConnectWallet, setShowModalConnectWallet] = useState(false)

  const getProfile = async () => {
    try {
      const { data } = await marketService.getMe()
      if (!data) return
      setProfile(data)
      const keypass = localStorage.getItem(WALLET_PRIVATE_KEY_PASSWORD)
      if (data?.walletPrivateKey?.startsWith("0x")) {
        const signer = new ethers.Wallet(data?.walletPrivateKey, provider); //pk
        if (signer.address == data?.walletAddress) {
          return
        }
      }
      const pk = decrypt(data?.walletPrivateKey, keypass || data?.authen_ScopeID)
      if (!pk) {
        setShowPassword(true)
      }
    } catch (err) {
      console.log('err', err)
    }
  };

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("jwt"))
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      getProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!window) return;
    setDomain(window?.origin);
  }, []);

  const onLogout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem("code")
    // eraseCookie(ACCESS_TOKEN);
    // eraseCookie(REFRESH_TOKEN);
  };

  const value = useMemo(
    () => ({
      globalData: globalData?.data,
      domain,
      locale,
      locales,
      activeChain,
      setActiveChain,
      profile,
      getProfile,
      isAuthenticated,
      setIsAuthenticated,
      // currentConnectedAccount,
      onLogout,
      showSetting,
      setShowSetting,
      showPassword,
      setShowPassword,
      showEncrypt,
      setShowEncrypt,
      action,
      setAction,
      showModalConnectWallet,
      setShowModalConnectWallet,
    }),
    [
      globalData?.data,
      domain,
      locale,
      locales,
      activeChain,
      profile,
      isAuthenticated,
      // currentConnectedAccount,
      onLogout,
      showSetting,
      showPassword,
      showEncrypt,
      action,
      showModalConnectWallet,
    ]
  );
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
