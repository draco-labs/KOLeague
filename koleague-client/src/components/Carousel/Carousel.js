import React, { useState, useEffect } from "react";
import Image from "next/image";
import iconGreenTick from "@/assets/images/new-icon-greentick.svg";
import { convertClickTwitterLink, convertTwitterLinkToHandle } from "@/utils";
import iconX from "@/assets/images/new-icon-X.svg";
import Modal from "@/pages/components/Modal";
import loadingImage from "@/assets/images/new-not-found.webp";
import { highlightContent } from "@/utils";

const formatRelativeTime = (inputDate) => {
  const [datePart, timePart] = inputDate.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  const localDate = new Date(year, month - 1, day, hours, minutes, seconds);
  const date = new Date(localDate.toISOString()); // Chuyển sang UTC

  const now = new Date();
  const nowUTC = new Date(now.toISOString());

  const diffMs = nowUTC - date;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "a day ago";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const Carousel = ({ latestTweet }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openImage, setOpenImage] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(null);
  const images = latestTweet?.map(
    (item) =>
    ({
      avatar: item?.avatar,
      name: item?.name,
      twitter: item?.postURL,
      time: formatRelativeTime(item?.createAt),
      image: item?.image?.[0],
      content: item?.content,
    } || [])
  );

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openModal = (index) => {
    setModalImageIndex(index);
    setOpenImage(true);
    setIsLoading(true);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  const autoSlideInterval = 8000;
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, autoSlideInterval);

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(interval);
  }, [currentIndex]);


  
  return (
    <div className="  basis-[40%] relative flex flex-col gap-4 items-center justify-start ">
      <div className="absolute top-0 right-0 bg-[#08efe8] border-[2px] border-[#202031] rounded-bl-[100px] rounded-tr-[24px] z-30 px-3 py-[6px] flex items-center justify-start gap-[6px] ">
        <Image src={iconX} alt="iconX" width={14} height={14} />
        <span className="text-sm font-medium text-[#0d0d15] leading-tight">Lastest Tweets</span>
      </div>
      <div className="flex flex-col w-full bg-[#0d0d15] border-[1px] border-[#202031] py-4 pl-4 rounded-lg gap-4">

        {/* Carousel wrapper */}
        <div className="relative overflow-hidden w-full rounded-lg md:h-36 h-52">
          {images.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-700 h-full ease-in-out ${index === currentIndex ? "translate-x-0" : "translate-x-full"
                } ${index < currentIndex ? "-translate-x-full" : ""}`}
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%)`,
              }}
            >
              <div className="flex flex-row items-center justify-start gap-1 w-full cursor-pointer" onClick={() => window.open(convertClickTwitterLink(item?.twitter), '_blank')}>
                <Image
                  src={item?.avatar || "/logo.png"}
                  alt="Avatar"
                  width={27}
                  height={27}
                  className="rounded-full"
                />
                <span className="text-white text-base font-semibold leading-normal">
                  {item?.name}
                </span>
                <Image
                  src={iconGreenTick}
                  alt="tick"
                  width={16}
                  height={16}
                />
                <span className="text-[#8f8f9c] text-sm font-normal leading-tight pl-[2px] items-center inline-flex ">
                  <a className="hidden min-[1650px]:block">{convertTwitterLinkToHandle(item?.twitter)} •</a> {item?.time}
                </span>
              </div>
              <div className="flex md:flex-row flex-col gap-3 mt-[10px] items- justify-between w-full">
                <span className="text-base font-normal leading-normal cursor-pointer block w-full h-full custom-ellipsis md:pr-0 pr-4" onClick={() => window.open((item?.twitter), "_blank")}
                  dangerouslySetInnerHTML={{ __html: highlightContent(item?.content)}}
                />
                {item?.image &&
                  <div className=" h-[110px] overflow-hidden flex justify-end items-center pr-4">
                    <Image
                      src={item?.image}
                      width={100}
                      height={100}
                      className="object-contain w-fit h-full cursor-pointer"
                      alt={`Slide ${index + 1}`}
                      onClick={() => openModal(index)}
                    />
                  </div>
                }
              </div>
            </div>
          ))}

        </div>
      </div>
      <div className="z-30 flex  space-x-3 md:mb-0 mb-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-[#08efe8]" : "bg-[#4d4d5a]"
              }`}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
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
          {modalImageIndex !== null && (
            <>
              {isLoading && (
                <div className="loading-squares"></div>
              )}
              <img
                src={images[modalImageIndex]?.image}
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
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Carousel;
