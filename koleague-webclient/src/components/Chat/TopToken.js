import { numberWithCommas } from '@/utils'
import React from 'react'

const TopToken = ({topToken, handleClick}) => {
    console.log(topToken, "topToken")
  return (
    <div
            className={`grid w-full grid-cols-1 gap-2`}
        >

            {topToken.map((token, index) => (
                <div
                    key={index}
                    className="px-4 py-2 w-full hover:bg-[#1d1d2d] bg-[#171723] rounded-lg text-white text-base flex gap-3 items-center justify-start cursor-pointer" onClick={() => handleClick && handleClick(token)}>
                    <span className='text-white'> {index+1})</span>
                    <div className="flex flex-col flex-1 ">
                        <span
                            className="text-white text-base min-[475px]:max-w-full max-w-[90px]  inline-block font-semibold cursor-pointer leading-normal overflow-hidden text-ellipsis"
                            onClick={() => {
                                // handleScreenNameClick(
                                //     user?.screenName,
                                //     user?.avatarUrl,
                                //     user?.twitterUrl
                                // );
                            }}
                        >
                            {token?.pair}
                        </span>
                        <span
                            className="text-sm font-semibold sm:max-w-full max-w-[80px]  inline-block text-[#08efe8] leading-tight overflow-hidden text-ellipsis"

                        >
                            <a className='text-left'>Vol(24h): {numberWithCommas(Math.floor(token?.["vol_24h"]))} $</a>
                            <a className='text-right pl-8'>TXNs(24h): {numberWithCommas(token?.["txn_24h"])}</a>
                        </span>
                    </div>
                </div>
            ))}
        </div>
  )
}

export default TopToken