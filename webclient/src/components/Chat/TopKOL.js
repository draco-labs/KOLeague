import React from 'react'
import Image from "next/image";
import avatar from "@/assets/images/new-avatar-template.png";


const TopKOL = ({ topKOL }) => {
    console.log(topKOL, "topKOL")
    return (
        <div
            className={`grid w-full grid-cols-${topKOL.length > 1 ? "2" : "1"
                } gap-2`}
        >

            {topKOL.map((user, index) => (
                <div
                    key={index}
                    className="px-4 py-2 w-full hover:bg-[#1d1d2d] bg-[#171723] rounded-lg text-white text-base flex gap-3 items-center justify-start">
                    <Image
                        src={user?.profileUrl || avatar}
                        width={56}
                        height={56}
                        className="rounded-full cursor-pointer basis-[50px]"
                        alt={"avatar"}
                        onClick={() => { window.open(`/KOLinsight/${user?.screenName}`, "_blank") }
                        }
                    />
                    <div className="flex flex-col flex-1 ">
                        <span
                            className="text-white text-base min-[475px]:max-w-full max-w-[90px]  inline-block font-semibold cursor-pointer leading-normal overflow-hidden text-ellipsis"
                            onClick={() => {
                                // handleScreenNameClick(
                                //     user?.screenName,
                                //     user?.avatarUrl,
                                //     user?.twitterUrl
                                // );
                                window.open(`/KOLinsight/${user?.screenName}`, "_blank");
                            }}
                        >
                            {user?.screenName}
                        </span>
                        <span
                            className="text-sm font-semibold sm:max-w-full max-w-[80px]  inline-block text-[#08efe8] leading-tight overflow-hidden text-ellipsis"

                        >
                            Rank {index + 1}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TopKOL