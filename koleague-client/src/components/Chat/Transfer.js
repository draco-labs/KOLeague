import React, { useEffect, useState } from 'react';
import iconArrow from "@/assets/images/new-icon-arrow.svg";
import Image from "next/image";
import { getValue, roundOrKeep } from '@/utils';
import { TOKEN_ADDRESS_CONSTANT, provider, transfer } from '@/utils/contract/swap';
import { Account, constants } from "starknet";
import { useAccount } from '@starknet-react/core';
import { getTokenDataByTokenAddress } from '@/utils/contract/getBalance';
import { useGlobalContext } from '@/contexts/GlobalProvider';


const Transfer = ({ amount, token, address }) => {
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false);
    const { account } = useAccount();
    const { showModalConnectWallet: modalWallet, setShowModalConnectWallet: setModalWallet } = useGlobalContext()
    const [price, setPrice] = useState({})
    const initPrice = async () => {
            const newPrice = { ...price };
            for (const token in TOKEN_ADDRESS_CONSTANT) {
                if (TOKEN_ADDRESS_CONSTANT.hasOwnProperty(token)) {
                const dataPrice = await getTokenDataByTokenAddress(TOKEN_ADDRESS_CONSTANT[token]);
                newPrice[token] = dataPrice.priceUsd;
          }
        }
        setPrice(newPrice);
        console.log('newPrice', price)
      };
    useEffect(() => {
        initPrice();
    }, []);

    const handleSubmit = async () => {
        if (done || loading) return
        if (!account) {
            setModalWallet(true)
            return
        }
        setLoading(true)
        const wallet = getValue('wallet_data');
        if (!account && (!wallet || !wallet.addressWallet || !wallet.privateKey)) {
            console.error("Wallet data is missing or incomplete");
            return;
        }
        let accountPk = null;
        if (wallet) {
            accountPk = new Account(provider, wallet.addressWallet, wallet.privateKey, "1", constants.TRANSACTION_VERSION.V3,);
            console.log(accountPk, "accountPk")
        }
        const data = await transfer(amount, TOKEN_ADDRESS_CONSTANT[token || "STRK"], address, wallet ? accountPk : account);
        console.log('data', data);
        if (data.status) {
            setDone(true)
        }
        setLoading(false)
    };

    return (
        <div className='w-[400px] p-4 rounded-md gap-4 flex flex-col items-center justify-center border-[1px] border-[#202031] shadow-md shadow-amber-100 mt-2'>
            <div className='border-[1px] border-[#202031] flex items-center justify-between w-full rounded-md p-3'>
                <span className='flex flex-col items-center justify-start'> 
                    <span className='text-[20px] mb-1'>{amount}</span>
                    <span className='text-[#90909c] shadow-sm'> $ {roundOrKeep(price[token]*amount || 0)}</span>
                </span>
                <span className='text-[20px] mb-1'> {token}</span>
            </div>
            <Image src={iconArrow} width={24} height={24} className=" cursor-pointer " alt={"avatar"} />
            <div className='border-[1px] border-[#202031] flex items-center justify-between w-full rounded-md p-3 overflow-hidden'>
                <span>{address}</span>
            </div>
            <div className={`uppercase px-4 rounded-lg py-[6px] text-base font-bold cursor-pointer leading-normal text-center bg-[#08EFE8] text-[#0D0D15] ${done && "!cursor-not-allowed opacity-[0.3]"}`} onClick={handleSubmit}>{loading ? "Processing..." : (done ? "Done" : (account ? "Confirm" : "Connect wallet"))} </div>
            {
                done && <div className=''>Success!</div>
            }

        </div>
    )
}

export default Transfer