import React, { useEffect, useState } from "react";
import logo from "@/assets/images/new-logo.png";
import bottomHeader from "@/assets/images/new-bottom-header.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import logoTwitter from "@/assets/images/new-icon-twitter.svg";
import logoDiscord from "@/assets/images/new-icon-discord.svg";
import logoTelegram from "@/assets/images/new-icon-telegram.svg";
import logoGithub from "@/assets/images/new-icon-github.svg";
import iconMenu from "@/assets/images/new-icon-menu.svg";
import iconClose from "@/assets/images/new-icon-close.svg";
import { useContextStore } from "@/contexts/index";
import { formatAddress } from "@/utils";
import iconLogout from "@/assets/images/new-icon-logout.svg";
import toast from "react-hot-toast";
import Modal from "@/pages/components/Modal";
import { setValue, getValue, removeValue } from "@/utils";
import imageConnect from "@/assets/images/new-image-connect.png";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { HISTORY_CHAT } from "@/constants";

const Header = () => {
  const router = useRouter();
  const { pathname } = router;
  const [mobileMode, setMobileMode] = useState();
  const [openMenu, setOpenMenu] = useState(false);
  const [enterInput, setEnterInput] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [addressWallet, setAddressWallet] = useState("");
  const [hasWalletData, setHasWalletData] = useState(false);
  const {connectWallet, isConnected, address, disconnect} = useContextStore();
  const { showModalConnectWallet: modalWallet, setShowModalConnectWallet: setModalWallet } = useGlobalContext()

  const handleConfirmClick = () => {
    const walletData = {
      privateKey,
      addressWallet,
    };
    setValue('wallet_data', walletData);
    setHasWalletData(true);
    setModalWallet(false);
    toast.success('Connect success');
  };

  const handleClearStorage = () => {
    removeValue('wallet_data');
    localStorage.removeItem(HISTORY_CHAT)
    setHasWalletData(false);
    setEnterInput(false);
  };
  console.log(getValue('wallet_data'));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setMobileMode(true);
      } else {
        setMobileMode(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const walletData = getValue('wallet_data');
    setHasWalletData(!!walletData);
    hasWalletData && setModalWallet(false);
    isConnected && setModalWallet(false);
    isConnected && removeValue('wallet_data');
  }, [isConnected, hasWalletData, ]);
  return (
    <div className="relative bg-[#12121B] h-16">
      <div className="relative flex items-center justify-center">
        {/* {!mobileMode && (
          <div className="justify-center items-center inline-flex md:w-[422px] w-[350px] py-5">
            <span
              className={`grow shrink basis-0 text-center text-base font-semibold leading-normal cursor-pointer ${
                pathname === "/" ? "text-[#08EFE8]" : "text-white"
              }`}
              onClick={() => router.push("/")}
            >
              Leaderboard
            </span>
            <span
              className={`grow shrink basis-0 text-center text-base font-semibold leading-normal cursor-pointer ${
                pathname.startsWith("/KOLinsight/")? "text-[#08EFE8]" : "text-white"
              }`}
             
            >
              KOL Insights
            </span>
          </div>
        )} */}
        <div className="absolute top-4 md:right-[52px] right-4 flex items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-4">
            <Image src={logoTwitter} alt="logoTwitter" className="cursor-pointer" onClick={() => window.open("https://x.com/KOLeagueAI", "_blank")} />
            {/* <Image src={logoDiscord} alt="logoDiscord" className="cursor-pointer" onClick={() => window.open("", "_blank")} /> */}
            <Image src={logoTelegram} alt="logoTelegram" className="cursor-pointer" onClick={() => window.open("https://t.me/kol_chat_agent", "_blank")} />
            <Image src={logoGithub} alt="logoGithub" className="cursor-pointer" onClick={() => window.open("https://github.com/draco-labs/StarkNest", "_blank")} />
          </div>
        {pathname === "/chat" ? 
          (!isConnected && !hasWalletData ? <div className=" uppercase px-4 rounded-lg py-[6px] text-base font-bold cursor-pointer leading-normal text-center bg-[#08EFE8] text-[#0D0D15]" onClick={() => setModalWallet(true)}>
            start the journey
          </div> : null)
          || (isConnected ? <div className="border-[1px] border-[#202031] text-sm font-medium text-[#90909c] shadow-sm shadow-[#d39a2e] leading-tight px-4 rounded-lg py-[6px] flex items-center gap-2">
            <span>{formatAddress(address)}</span>
            <Image src={iconLogout} alt="iconLogout" width={16} className="cursor-pointer" onClick={() => {disconnect(); handleClearStorage(); toast.success('Disconnect success')}} />
          </div> : null)
          || (hasWalletData ? <div className="border-[1px] border-[#202031] text-sm font-medium text-[#90909c] shadow-sm shadow-[#d39a2e] leading-tight px-4 rounded-lg py-[6px] flex items-center gap-2">
            <span>{formatAddress(getValue("wallet_data")?.addressWallet)}</span>
            <Image src={iconLogout} alt="iconLogout" width={16} className="cursor-pointer" onClick={() => {handleClearStorage("wallet_data"); toast.success('Disconnect success')}} />
          </div> : null)
        : <div className=" uppercase px-4 rounded-lg py-[6px] text-base font-bold cursor-pointer leading-normal text-center bg-[#08EFE8] text-[#0D0D15]" onClick={() => router.push("/chat")}>
          Chat
        </div>}
        </div>

        <div className="absolute flex gap-2 justify-start md:left-[47px] left-[16px] top-4 z-50">
          {mobileMode && (
            <Image
              src={!openMenu ? iconMenu : iconClose}
              alt="iconMenu"
              width={24}
              className="cursor-pointer"
              onClick={() => {
                setOpenMenu(!openMenu)}}
            />
          )}
          <Image src={logo} alt="logo" width={100} className="cursor-pointer" onClick={() => router.push("/")} />
        </div>
      </div>
      {!mobileMode && (
        <div className="absolute flex justify-center -bottom-5 left-0 w-full">
          <Image src={bottomHeader} alt="bottomHeader" />
        </div>
      )}

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      <div
        className={`fixed h-[93%] w-full z-[100] sm:hidden bg-transparent backdrop-blur-sm bottom-0 right-0 -translate-x-full duration-500 transition-all ${openMenu && "translate-x-0"
          }`}
        style={{
          background: "linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.6) 46%, rgba(3, 94, 91, 0.6) 100%)"
        }}
      >
        <section className="text-white flex flex-col justify-start items-center h-full">
          <div
            className="bg-[#0D0D15] w-full p-[16px] hover:bg-[#12121B] border-b-[1px] border-neutral-500 "

          >
            <span
              className={`text-2xl text-left font-[500] cursor-pointer ${pathname === "/" ? "text-[#08EFE8]" : "text-white"
                }`}
              onClick={() => {
                router.push("/");
                setOpenMenu(false);
              }}
            >
              Leaderboard
            </span>
          </div>
          <div
            className="bg-[#0D0D15] w-full p-[16px] hover:bg-[#12121B] border-b-[1px] border-neutral-500"

          >
            <span
              className={`text-2xl text-left font-[500] font-Rubik cursor-pointer ${pathname.startsWith("/KOLinsight/") ? "text-[#08EFE8]" : "text-white"
                }`}
              onClick={() => {
                setOpenMenu(false);
              }}
            >
              KOL Insights
            </span>
          </div>
        </section>
      </div>
      <Modal
        title=""
        hidden
        open={modalWallet}
        handleCancel={() => {
          setModalWallet(false);
          setEnterInput(false);
        }}
        className="w-[500px] bg-[#0d0d15] rounded-md border-[1px] border-[#202031] p-8"
        closed={true}
      > 
      <div className="flex flex-col items-center justify-center">
      <Image src={imageConnect} alt="imageConnect" width={170} height={170} />
            <span className="text-white text-2xl font-semibold font-['Rubik'] leading-loose">CONNECT WALLET</span>
            <span className="text-[#adadbc] text-base font-medium font-['Rubik'] leading-normal">Select one option below to continue</span>
      
        <div className={`w-full h-full flex  ${enterInput ? "flex-col":"flex-row"} justify-center gap-10 items-center py-10 `}>
          
           
            <div className="bg-[#08efe8] text-center text-[#0d0d15] text-base font-bold leading-normal w-full py-[6px] rounded-lg border-[1px] border-[#202031] cursor-pointer" onClick={() => setEnterInput(true) }> Import Private Key</div>
            {!enterInput && <div className="bg-[#dcf808] text-center text-[#0d0d15] text-base font-bold leading-normal w-full py-[6px] rounded-lg border-[1px] border-[#202031] cursor-pointer" onClick={connectWallet}> I have my wallet</div>}
            {enterInput && <div className="w-full flex flex-col items-center justify-center gap-10">
              <input
              type="text"
              placeholder="Address Wallet..."
              value={addressWallet}
              onChange={(e) => {
                setAddressWallet(e.target.value);
              }}
              // onFocus={fetchUsers}
              //onBlur={handleBlur}
              className="pl-5  py-[14px] w-full h-full text-zinc-400 text-base font-medium border-none bg-transparent leading-normal"
            />
              <input
              type="text"
              placeholder="Private Key..."
              value={privateKey}
              onChange={(e) => {
                setPrivateKey(e.target.value);
              }}
              // onFocus={fetchUsers}
              //onBlur={handleBlur}
              className="pl-5  py-[14px] w-full h-full text-zinc-400 text-base font-medium border-none bg-transparent leading-normal"
            />
            <div className="uppercase px-4 rounded-lg py-[6px] text-base font-bold cursor-pointer leading-normal text-center bg-[#08EFE8] text-[#0D0D15]" onClick={handleConfirmClick}>Confirm </div> 
            </div>}
        </div>
        </div>
      </Modal>
    </div>
  );  
};

export default Header;
