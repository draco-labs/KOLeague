import React, { useState, useEffect } from 'react'
import { tierIcons } from "@/pages/index";
import Image from 'next/image';
import iconBTC from "@/assets/images/new-icon-BTC.svg";
import iconArrow from "@/assets/images/new-icon-arrow.svg";
import Tweet from '../Tweet/Tweet';
import Skeleton from '../Skeleton/Skeleton';
import CombinedChart from '../Charts/CombinationChart';
import ColumnChart from '../Charts/ColumnChart';
import { useContextStore } from "@/contexts/index";
import { formatDateToUTC } from "@/utils";
import notFound from "@/assets/images/new-not-found.webp";

const category = ['Time', 'Calls ROI', 'Type', '1m', '3m', '5m', '15m', '30m', '1h', '3h', '6h', '24h', '........']
const data = [
  "0.08", "0.08", "-0.08", "0.08", "0.08", "-0.08", "0.08", "0.08", "-0.08"

]

const menuMobile = ["Call Metrics", "Call ROI"]
const Calls = ({ profile, loading }) => {
  const [activeTab, setActiveTab] = useState("Call ROI");
  const [openDetail, setOpenDetail] = useState([]);
  const [mobileMode, setMobileMode] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { closeTweet } = useContextStore();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleDetail = (id) => {
    setOpenDetail((prevOpenDetail) =>
      prevOpenDetail.includes(id)
        ? prevOpenDetail.filter((openId) => openId !== id)
        : [...prevOpenDetail, id]
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setMobileMode(true);
        setActiveTab("Call ROI");
      } else {
        setMobileMode(false);
        setActiveTab("No Hidden");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="md:hidden flex items-center w-full border-b-[1px] border-[#202031]">
        {menuMobile.map((item) => (
          <div
            key={item}
            className={`text-base font-medium leading-normal basis-1/2 text-center px-4 py-[6px] cursor-pointer ${activeTab === item
              ? "border-b-2 border-[#dcf808] text-[#08efe8]"
              : "text-[#8f8f9c]"
              }`}
            onClick={() => handleTabClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className='flex items-start md:justify-between justify-center md:gap-6 px-3 mt-6 min-[1440px]:px-[132px] w-full'>
        {/* Ranked tab */}
        {(activeTab === "Call Metrics" || activeTab === "No Hidden") && (
          <div className="flex flex-col md:basis-[24%] w-[100%] md:max-w-[400px]">
            <div className="md:block hidden z-10 bg-[#202031] mb-[-16px] w-fit  rounded-lg text-lg font-[900] text-[#ffffff] px-10 pt-[6px] pb-[24px] uppercase leading-6 italic">
              <span className="leading-6 text-lg font-[900] inline-flex">
                CALL METRICS
              </span>
            </div>
            <div className="z-20 flex shadow-custom-top flex-col  w-full bg-[#171723] p-4 rounded-lg gap-4 border-[1px] border-[#202031]">
              <div className="flex flex-row  bg-[#0D0D15] justify-start gap-4 p-2">
                {loading ? (
                  <div className="animate-pulse w-[100px] h-[100px] rounded-lg bg-[#D3EC17]" />
                ) : (
                  <div className="bg-[#D9E900] p-[10px] w-[100px] h-[100px] rounded-lg flex items-center justify-center border-[2px] border-[#202031]">
                    <Image
                      src={tierIcons[profile?.tier]}
                      alt="Icon Tier"
                      width={80}
                    />
                  </div>
                )}
                <div className="flex flex-col items-center justify-start ">
                  <span className="text-2xl font-medium leading-loose text-white inline-flex w-full text-left">
                    {profile?.tier}
                  </span>
                  <span className="text-lg font-semibold text-[#dcf808] leading-relaxed text-left w-full">
                    {
                      profile?.recentMatches?.[
                      profile?.recentMatches.length - 1
                      ]
                    }
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[11px]">
                <div className="flex flex-col items-center justify-start p-2 rounded-lg bg-[#0D0D15]">
                  <span className="text-sm font-normal text-[#8f8f9c] leading-tight w-full text-left">
                    Profitable Rate
                  </span>
                  {loading ? (
                    <Skeleton css="start" />
                  ) : (
                    <span className="text-lg font-semibold text-white leading-relaxed w-full text-left">
                      {profile?.profit.toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-start p-2 rounded-lg bg-[#0D0D15]">
                  <span className="text-sm font-normal text-[#8f8f9c] leading-tight w-full text-left">
                    Average ROI
                  </span>
                  {loading ? (
                    <Skeleton css="start" />
                  ) : (
                    <span className="text-lg font-semibold text-white leading-relaxed w-full text-left">
                      {profile?.averageROI}%
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-start p-2 rounded-lg bg-[#0D0D15]">
                  <span className="text-sm font-normal text-[#8f8f9c] leading-tight w-full text-left">
                    Max Drawdown
                  </span>
                  {loading ? (
                    <Skeleton css="start" />
                  ) : (
                    <span className={`text-lg font-semibold ${profile?.maxDD >= 0 ? "text-[#08EF46]" : "text-[#e1584b]"} leading-relaxed w-full text-left`}>
                      {profile?.maxDD.toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-start p-2 rounded-lg bg-[#0D0D15]">
                  <span className="text-sm font-normal text-[#8f8f9c] leading-tight w-full text-left">
                    Sharpe Ratio
                  </span>
                  {loading ? (
                    <Skeleton css="start" />
                  ) : (
                    <span className="text-lg font-semibold text-white leading-relaxed w-full text-left">
                      {(profile?.sr).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Coin tab */}
        {(activeTab === "Call ROI" || activeTab === "No Hidden") && (
          <div className="flex flex-col flex-1 overflow-hidden w-full">
            <div className="md:block hidden z-10 bg-[#202031] mb-[-16px] w-fit  rounded-lg text-lg font-[900] text-[#ffffff] px-10 pt-[6px] pb-[24px] uppercase leading-6 italic">
              calls roi
            </div>
            <div className=" w-full z-20 flex flex-col overflow-x-scroll bg-[#171723] md:p-4 md:rounded-lg gap-4 shadow-custom-top border-[1px] border-[#202031]">
              <span className='text-[#8f8f9c] md:block hidden text-base font-normal leading-normal'>Track and aggregate call ROI and Twitter activity changes over time</span>
              {!profile.matchHistory ? <div className="flex flex-col items-center justify-center h-full mt-16">
                <Image src={notFound} alt="notfound" width={125} height={125} />
                <span className="text-[16px] text-center leading-6 font-[500] text-[#90909C]">
                  No matches found.
                </span>
                <span className="text-[16px] text-center leading-6 font-[500] text-[#90909C]">
                  Try a hard refresh.
                </span>
              </div> :
                <div className="flex justify-center gap-4 w-full ">
                  <div class=" w-full overflow-x-scroll">
                    <table class="w-full text-sm text-left ">
                      <thead class="text-xs text-gray-700 uppercase bg-[#171723]">
                        <tr>
                          {category.map((item) => (
                            <th scope="col" key={item} className={` ${item === "........" ? "text-[#171723]" : "text-white"} text-sm font-medium leading-tight`}>
                              {item}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {profile.matchHistory.map((item, index) => (
                          <React.Fragment key={index}>
                            <tr className="">
                              <td className="text-[#adadbc] text-sm font-normal leading-tight">{formatDateToUTC(item?.tweetTime)}</td>
                              <td className='flex gap-[6px] w-[200px] items-center justify-start'>
                                <Image src={item?.token?.icon} alt="iconBTC" width={35} height={35} />
                                <span>{item?.token?.coin} <br /> {item?.token?.name}</span>
                              </td>
                              <td className={`${item?.actionPrompt === "buy" ? "text-[#08ef45]" : "text-[#e1584b]"} text-sm font-[600] leading-tight`}>{item?.actionPrompt === "buy" ? "LONG" : "SHORT"}</td>
                              {data.map((roiPoint, index) => (
                                <td key={index} className={`${roiPoint < 0 ? 'text-[#e1584b]' : 'text-[#08ef45]'} text-sm font-[500] leading-tight`}>
                                  {roiPoint < 0 ? roiPoint : "+" + roiPoint}%
                                </td>
                              ))}
                              <td onClick={() => toggleDetail(index)} className="cursor-pointer">
                                <Image
                                  src={iconArrow}
                                  alt="iconArrow"
                                  width={40}
                                  height={24}
                                  className={`transition-transform duration-500 ${openDetail.includes(index) ? "rotate-180" : "rotate-0"}`}
                                />
                              </td>
                            </tr>
                            {openDetail.includes(index) && (
                              <tr>
                                <td colSpan={category.length + 1} className='!p-0'>
                                  <div className={`flex md:flex-row flex-col ${mobileMode ? `w-[${screenWidth}px] ` : "w-full "}h-full`} style={mobileMode ? { width: `${screenWidth - 24}px` } : {}}>


                                    <Tweet tweetId={index} data={item} />


                                    <div className={`flex flex-col ${closeTweet[index] && !mobileMode ? "w-full" : "w-2/3"} ${mobileMode && "!w-full"} gap-1 px-[24px] py-[12px] bg-[#12121b]`}>
                                      
                                      <CombinedChart  newDataLine={item}/>
                                      
                                      <ColumnChart dataColumn = {item.oI_data} />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>}
            </div>
          </div>
        )}



      </div>
    </>
  )
}

export default Calls;