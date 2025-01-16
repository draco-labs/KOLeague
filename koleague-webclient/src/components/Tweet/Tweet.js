import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import iconGreenTick from "@/assets/images/new-icon-greentick.svg";
import { convertClickTwitterLink, convertTwitterLinkToHandle, highlightContent } from "@/utils";
import avatar from "@/assets/images/new-avatar.png";
import iconArrow from "@/assets/images/new-icon-arrow.svg";
import iconX from "@/assets/images/new-logoX1.svg";
import imageTweet from "@/assets/images/new-image-tweets.png"
import imageReward from "@/assets/images/new-image-reward.png"
import imageReward2 from "@/assets/images/new-image-reward2.png"
import { useContextStore } from "@/contexts/index";
import Modal from "@/pages/components/Modal";


const Tweet = ({tweetId, data}) => {
    const { closeTweet, setCloseTweet, mobileMode } = useContextStore();
    const [isLoading, setIsLoading] = useState(false);
    const [openImage, setOpenImage] = useState(false);

    const handleToggleCloseTweet = () => {
        setCloseTweet((prevCloseTweet) => ({
          ...prevCloseTweet,
          [tweetId]: !prevCloseTweet[tweetId],
        }));
      };

    const openModal = () => {

        setOpenImage(true);
        setIsLoading(true);
    };
    return (
        <div className={`relative z-0 flex flex-col gap-3 bg-[#0d0d15] p-4 basis-1/3  md:translate-x-0  translate-y-0 duration-500 transition-all ${closeTweet[tweetId] && " md:-translate-x-full -translate-y-full !basis-[5%] "}`}>
            <div className={` absolute flex top-4 ${!closeTweet[tweetId]?"right-4": mobileMode ?"left-4": "right-4"} cursor-pointer ${closeTweet[tweetId] && !mobileMode && "flex-col gap-2 items-center  "} ${closeTweet[tweetId] && mobileMode && "flex-row gap-2 items-center  "} `} onClick={handleToggleCloseTweet}>
                {closeTweet[tweetId] && !mobileMode &&
                    <><Image
                        src={iconArrow}
                        alt="iconArrow"
                        width={14}
                        height={14}
                        className={`transition-transform duration-500 -rotate-90 `}
                    /><Image src={imageReward} alt="iconX" width={20} height={140} className="" /></>}
                {closeTweet[tweetId] && mobileMode &&
                    <><Image src={imageReward2} alt="iconX" width={140} height={20} className="" />
                    <Image
                        src={iconArrow}
                        alt="iconArrow"
                        width={14}
                        height={14}
                        className={`transition-transform duration-500 -rotate-90 `}
                    /></>}
                {!closeTweet[tweetId] &&
                    <><Image
                        src={iconArrow}
                        alt="iconArrow"
                        width={14}
                        height={14}
                        className={`transition-transform duration-500 ${closeTweet[tweetId] ? "-rotate-90 ml-[100px] " : "rotate-90"}`}
                    />
                        <span className={`text-[14px] leading-5 font-[400] text-[#ADADBC] `}> Close</span></>}
            </div>
            {!closeTweet[tweetId] && <>
                <div className="flex  flex-row items-center justify-start gap-1 w-full cursor-pointer" onClick={() => window.open(convertClickTwitterLink(''), '_blank')}>
                    <Image
                        src={data?.avatar}
                        alt="Avatar"
                        width={44}
                        height={44}
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <span className="text-white text-base font-semibold leading-normal inline-flex gap-2">
                            {data?.screenName}
                            <Image
                                src={iconGreenTick}
                                alt="tick"
                                width={16}
                                height={16}
                            />
                        </span>
                        <span className="text-[#8f8f9c] text-sm font-normal leading-tight pl-[2px] items-center inline-flex ">
                            {convertTwitterLinkToHandle(data?.post_url)} • {data?.tweetTime}
                        </span>
                    </div>

                </div>

                <span className="text-base font-normal leading-normal cursor-pointer block md:pr-0 pr-4"
                    onClick={() => window.open((""), "_blank")}
                    dangerouslySetInnerHTML={{ __html: highlightContent(data?.full_text) }}
                />
                {/* <div className=" overflow-hidden flex justify-center items-center pb-6">
                    <Image
                        src={imageTweet}

                        className="object-contain w-full h-full cursor-pointer"
                        alt={`Slide `}
                        onClick={() => openModal()}
                    />
                </div> */}

            </>}
            <Modal
                title=""
                hidden
                open={openImage}
                handleCancel={() => {
                    setOpenImage(false);
                    setIsLoading(false); // Đảm bảo reset trạng thái khi đóng modal
                }}
                className="w-fit"
                closed={false}
            >
                <div className="w-full h-full flex flex-col justify-center items-center">
                    {isLoading && (
                        <div className="loading-squares"></div>
                    )}
                    <img
                        src={imageTweet}
                        alt="Large Image"
                        width={900}
                        height={900}
                        className={`object-contain w-full h-full max-h-[900px] ${isLoading ? "hidden" : "block"}`}
                        onLoad={() => {
                            setIsLoading(false); // Tắt trạng thái loading khi ảnh tải xong
                            console.log("Image loaded");
                        }}
                        onError={() => {
                            console.error("Image failed to load");
                            setIsLoading(false); // Tắt loading ngay cả khi lỗi
                        }}
                    />


                </div>
            </Modal>
        </div>
    )
}

export default Tweet