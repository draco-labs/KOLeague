import React from "react";

export const SkeletonRow = () => {
  return (
    <div className="animate-pulse flex items-center justify-start gap-2 2xl:px-[132px] px-4 py-2">
      <div className="text-[#ffffff] text-[24px] leading-6 basis-[6%] flex gap-[10px] py-4 px-2">
        <div className="bg-gray-300 h-6 w-6 rounded"></div>
      </div>
      <div className="flex gap-3 items-center basis-[18%] justify-start ">
        <div className="bg-gray-300 h-14 w-14 rounded-full"></div>
        <div className="flex flex-col pr-4">
          <div className="bg-gray-300 h-4 w-24 rounded"></div>
          <div className="bg-gray-300 h-4 w-16 rounded mt-2"></div>
        </div>
      </div>
      <div className="flex gap-1 basis-[20%] items-center justify-start">
        <div className="bg-gray-300 h-10 w-10 rounded"></div>
        <div className="bg-gray-300 h-4 w-24 rounded"></div>
      </div>
      <div className="basis-[9%] py-4">
        <div className="bg-gray-300 h-4 w-12 rounded"></div>
      </div>
      <div className="basis-[20%] py-4">
        <div className="bg-gray-300 h-4 w-32 rounded"></div>
      </div>
      <div className="basis-[15%] py-4">
        <div className="bg-gray-300 h-4 w-48 rounded"></div>
      </div>
      <div className="flex justify-end flex-1 py-4">
        <div className="bg-gray-300 h-4   text-right rounded w-12"></div>
      </div>
    </div>
  );
};

export const SkeletonProfile = () => {
  return (
    <div className="flex flex-col md:gap-2 animate-pulse">
      <div className="flex items-center justify-start gap-2">
        <div className="bg-gray-300 h-6 w-48 rounded"></div>
        <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
      </div>

      <div
        className="text-[16px] leading-6 h-6 w-2/3 font-[500] rounded-sm bg-[#08EFE8] pb-[9px] cursor-pointer ">
        
      </div>
      <div className=" md:flex hidden items-center justify-start gap-1">
        <div className="rounded-full w-6 h-6 bg-gray-300"></div>
        <div className="rounded-full w-6 h-6 bg-gray-300"></div>
        <div className="rounded-full w-6 h-6 bg-gray-300"></div>
      </div>
    </div>
  );
};

export const Skeleton = ({css}) => {
  
  return (
    <div className={`animate-pulse  w-full ${css === "start" ? `justify-start` : `justify-end`}  inline-flex mt-2`}>
      <div className="bg-gray-300 rounded-sm h-6 w-12 "> </div>
    </div>
  )
}
