import React from 'react';
import Image from "next/image";
import iconCoin from "@/assets/images/new-icon-coin.svg";


const TopCoin = ({topCoin}) => {
  return (
    <div
                className={`grid w-full grid-cols-${topCoin.length > 1 ? "2" : "1"
                    } gap-2`}
            >
    
                {topCoin.map((coin, index) => (
                    <div
                        key={index}
                        className="px-4 py-2 w-full hover:bg-[#1d1d2d] bg-[#171723] rounded-lg text-white text-base flex gap-3 items-center justify-start">
                        <Image
                            src={iconCoin}
                            width={56}
                            height={56}
                            className="rounded-full basis-[50px]"
                            alt={"avatar"}
                        />
                        <div 
                                className="text-white flex-1 text-base min-[475px]:max-w-full max-w-[90px]  inline-block font-semibold leading-normal overflow-hidden text-ellipsis"
                                onClick={() => {
                                    // handleScreenNameClick(
                                    //     user?.screenName,
                                    //     user?.avatarUrl,
                                    //     user?.twitterUrl
                                    // );
                                }}
                            >
                                {coin}
                            </div>
                            
                    </div>
                ))}
            </div>
  )
}

export default TopCoin