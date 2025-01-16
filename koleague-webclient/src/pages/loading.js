"use client";

import Image from "next/image";
import React from "react";
import loadingImage from "@/assets/images/new-image-loading.png";

const Loading = () => {
  return (
    <div className="  text-[18px] leading-7 font-[600] text-[#0fefe8] w-full h-[var(--100vh)] flex items-center justify-center fixed inset-0 z-[99999] bg-gradient-to-b from-[#0d0d15] from-85% to-[#22114A] flex-col gap-[0.5rem]">
      <Image src={loadingImage} width={150} height={150} alt="loading" className="loading-image"/>
      <div className="inline-flex gap-[6px] loading mt-6">
        <span>L</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  );
};

export default Loading;
