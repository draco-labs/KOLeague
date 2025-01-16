import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useRouter } from 'next/router';
import Modal from "../pages/components/Modal/index";
import banner from "../assets/images/banner-profile.png"
import avatar from "../assets/images/avatar.svg"
import { useGlobalContext } from "@/contexts/GlobalProvider";
import marketService from "@/services/market.service";
import { toast } from "react-hot-toast";
import { decrypt, encrypt } from "@/utils/encrypt";
import { WALLET_PRIVATE_KEY, WALLET_PRIVATE_KEY_ENCODE, WALLET_PRIVATE_KEY_PASSWORD } from "@/utils/constants";
import { ethers } from "ethers";
import { provider } from "@/utils/contract";
import useMounted from "@/hooks/useMounted";
import Loading from "@/pages/loading";
import useScaleLayout from "@/hooks/useScanLayout";

const Layout = (props) => {
  const router = useRouter();
  const routeName = router.pathname;
  const { showSetting, setShowSetting, profile, showPassword, setShowPassword, showEncrypt, setShowEncrypt, action, getProfile } = useGlobalContext()
  const [newProfile, setNewProfile] = useState({})
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showChange, setShowChange] = useState(false)
  const [newPk, setNewPk] = useState("")
  const {isMounted} = useMounted();


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (!profile?.accountID) return
    setNewProfile(profile)
  }, [profile])

  const onChange = (e) => {
    setNewProfile({
      ...newProfile,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = async () => {
    const loading = toast.loading("Processing...")
    try {
      const { data } = await marketService.updateAccount(newProfile)
      setShowSetting(false)
      toast.success("Done")
    } catch (err) {
      console.log('err', err)
      toast.error(err?.message)
    }
    toast.dismiss(loading)
  }

  const onSubmitPassword = async () => {
    try {
      const output1 = decrypt(profile?.walletPrivateKey, password)
      if (!output1) {
        toast.error("Password not match!")
      } else {
        localStorage.setItem(WALLET_PRIVATE_KEY, output1)
        localStorage.setItem(WALLET_PRIVATE_KEY_PASSWORD, password)
        setShowPassword(false)
      }
    } catch (err) {
      toast.error("Password not match!")
    }
  }

  const onSubmitChangeWallet = async () => {
    if (!newPk) {
      toast.error("Private Key invalid!")
      return
    }
    try {
      const signer = new ethers.Wallet(newPk, provider); //pk
      console.log('signer', signer)
    } catch (err) {
      toast.error("Private Key invalid!")
      return
    }
    const loading = toast.loading("Processing...")
    try {
      const { data } = await marketService.updateAccount({
        ...profile,
        walletPrivateKey: encrypt(newPk, password || localStorage.getItem("twitter_uid")),
      })
      console.log('data', data)
      localStorage.setItem(WALLET_PRIVATE_KEY, newPk)
      localStorage.setItem(WALLET_PRIVATE_KEY_PASSWORD, password)
      setShowChange(false)
      setPassword("")
      setNewPk("")
      getProfile()
      toast.success("Done")
    } catch (err) {
      console.log('err', err)
      toast.error(err?.message)
    }
    toast.dismiss(loading)
  }

  const onSubmitEncrypt = async () => {
    const output = encrypt(localStorage.getItem(WALLET_PRIVATE_KEY), password || localStorage.getItem("twitter_uid"))
    action && action()
    localStorage.setItem(WALLET_PRIVATE_KEY_ENCODE, output);
    localStorage.setItem(WALLET_PRIVATE_KEY_PASSWORD, password);
    setShowEncrypt(false)
  }
  {!routeName === "/chat" && useScaleLayout();}
  useEffect(() => {
    console.log("Running in ", process.env.MODE);
    if (process.env.MODE === "prod") {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
    }
  }, []);
  

  return <div>
    <Modal
      title='Profile Settings'
      hidden
      open={showSetting}
      handleCancel={() => {
        setShowSetting(false)
      }}
      className="w-[500px]"
    >
      <div className="text-black flex flex-col  pb-[20px] mt-[30px] px-[30px]">
        <div className="flex justify-between items-center w-full mb-[20px]">
          <div className="text-[#FAFAFA] font-medium"> Banner Image</div>
          <div className="px-[20px] py-[8px] rounded-[8px] bg-[#FAFAFA] font-medium cursor-pointer">Upload Image</div>
        </div>
        <img src={banner.src} className="w-full h-full" />

        <div className="flex flex-col items-start justify-start mt-[20px]">
          <p className="text-[#FAFAFA] font-medium mb-[10px]">User Profile</p>
          <div className="flex gap-2 items-center">
            <img src={profile?.imageProfile || avatar.src} className="rounded-full" />
            <div className="px-[20px] py-[10px] rounded-[8px] bg-[#FAFAFA] h-fit text-center flex items-center cursor-pointer font-medium">Upload Image</div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start mt-[20px]">
          <p className="text-[#FAFAFA] font-medium mb-[8px] flex justify-between items-center w-full">
            <span>Burner MPC Wallet</span>
            <span className="flex gap-2 items-center text-[#0EA5E9] cursor-not-allowed opacity-[0.3]" onClick={() => {
              return
              setShowSetting(false)
              setShowChange(true)
            }}>Change</span>
          </p>
          <input className="pl-[12px] py-[10px] rounded-[8px] outline-none bg-[#09090B] border-[1px] border-[#27272A] w-full text-[#FAFAFA]" disabled value={profile?.walletAddress} />
        </div>


        <div className="flex flex-col items-start justify-start mt-[20px]">
          <p className="text-[#FAFAFA] font-medium mb-[8px]">Twitter Account</p>
          <input className="pl-[12px] py-[10px] rounded-[8px] outline-none bg-[#09090B] border-[1px] border-[#27272A] w-full text-[#FAFAFA]" disabled value={"@" + profile?.accountName} />
        </div>


        <div className="flex flex-col items-start justify-start mt-[20px]">
          <p className="text-[#FAFAFA] font-medium mb-[8px]">Username</p>
          <input className="pl-[12px] py-[10px] rounded-[8px] outline-none bg-[#09090B] border-[1px] border-[#27272A] w-full text-[#FAFAFA]" disabled value={profile?.accountName} />
        </div>

        <div className="flex flex-col items-start justify-start mt-[20px]">
          <p className="text-[#FAFAFA] font-medium mb-[8px]">Bio</p>
          <textarea rows={4} className="pl-[12px] py-[10px] rounded-[8px] outline-none bg-[#09090B] border-[1px] border-[#27272A] w-full text-[#FAFAFA]" name="bio" placeholder="Type something special about you" value={newProfile?.bio} onChange={onChange} />
          <p className="text-[#A1A1AA] mt-[5px]">Your bio will be displayed on your profile page.</p>
        </div>

        <div className="flex gap-2 justify-end mt-[20px]">
          <div className="px-[20px] py-[8px] rounded-[8px] bg-[#18181B] text-[#FAFAFA] cursor-pointer font-medium" onClick={() => setShowSetting(false)}>Close</div>
          <div className="px-[20px] py-[8px] rounded-[8px] bg-[#FAFAFA] cursor-pointer font-medium" onClick={onSubmit}>Save Changes</div>
        </div>
      </div>
    </Modal>

    <Modal
      title='Password'
      hidden
      open={showPassword}
      handleCancel={() => {
        setShowPassword(false)
      }}
      className="w-[500px]"
    >
      <div className="text-black flex flex-col  pb-[20px] mt-[30px] px-[30px]">
        <div className="relative flex flex-col items-start justify-start mt-[20px]">
          {/* <p className="text-[#FAFAFA] font-medium mb-[8px]">Username</p> */}
          <input type={passwordVisible ? 'text' : 'password'} className="pl-[12px] py-[10px] rounded-[8px] outline-none bg-[#09090B] border-[1px] border-[#27272A] w-full text-[#FAFAFA]" placeholder="(Optional)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? ( // Thay đổi icon tùy theo trạng thái
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>

            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>

            )}
          </button>
        </div>

        <div className="flex gap-2 justify-end mt-[20px]">
          <div className="px-[20px] py-[8px] rounded-[8px] bg-[#FAFAFA] cursor-pointer font-medium" onClick={onSubmitPassword}>Continue</div>
        </div>
      </div>
    </Modal>

    <Modal
      title='Encrypt'
      hidden
      open={showEncrypt}
      handleCancel={() => {
        setShowEncrypt(false)
      }}
      className="w-[500px]"
    >
      <div className="text-black flex flex-col  pb-[20px] mt-[30px] px-[30px]">
        <div className="relative flex flex-col items-start justify-start mt-[20px]">
          {/* <p className="text-[#FAFAFA] font-medium mb-[8px]">Username</p> */}
          <input type={passwordVisible ? 'text' : 'password'} className="pl-[12px] py-[10px] rounded-[8px] outline-none bg-[#09090B] border-[1px] border-[#27272A] w-full text-[#FAFAFA]" placeholder="(Optional)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? ( // Thay đổi icon tùy theo trạng thái
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>

            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>

            )}
          </button>
        </div>

        <div className="flex gap-2 justify-end mt-[20px]">
          <div className="px-[20px] py-[8px] rounded-[8px] bg-[#FAFAFA] cursor-pointer font-medium" onClick={onSubmitEncrypt}>Continue</div>
        </div>
      </div>
    </Modal>

    <Modal
      title='Change Wallet'
      hidden
      open={showChange}
      handleCancel={() => {
        setShowChange(false)
      }}
      className="w-[500px]"
    >
      <div className="text-black flex flex-col pb-[20px] px-[30px]">
        <div className="flex flex-col items-start justify-start mt-[20px]">
          <p className="text-[#FAFAFA] font-medium mb-[8px]">Private Key</p>
          <input className="pl-[12px] py-[10px] rounded-[8px] outline-none bg-[#09090B] border-[1px] border-[#27272A] w-full text-[#FAFAFA]" value={newPk} onChange={(e) => setNewPk(e.target.value)} />
        </div>
        <p className="text-[#FAFAFA] font-medium mb-[8px] mt-[20px]">Password</p>
        <div className="relative flex flex-col items-start justify-start">
          <input type={passwordVisible ? 'text' : 'password'} className="pl-[12px] py-[10px] rounded-[8px] outline-none bg-[#09090B] border-[1px] border-[#27272A] w-full text-[#FAFAFA]" placeholder="(Optional)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? ( // Thay đổi icon tùy theo trạng thái
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>

            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>

            )}
          </button>
        </div>

        <div className="flex gap-2 justify-end mt-[20px]">
          <div className="px-[20px] py-[8px] rounded-[8px] bg-[#18181B] text-[#FAFAFA] cursor-pointer font-medium" onClick={() => setShowChange(false)}>Close</div>
          <div className="px-[20px] py-[8px] rounded-[8px] bg-[#FAFAFA] cursor-pointer font-medium" onClick={onSubmitChangeWallet}>Continue</div>
        </div>
      </div>
    </Modal>
    {!isMounted && <Loading/>}
    {routeName !== '/signin' && routeName !== '/signup' && <Header />}
    <div className="bg-gradient-to-b from-[#0d0d15] from-85% to-[#22114A] md:h-full h-[90vh]">
      {props.children}
      <Footer />
    </div>
    
  </div>
}

export default Layout;