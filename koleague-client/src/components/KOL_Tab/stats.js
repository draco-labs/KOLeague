import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import marketService from "@/services/market.service";
import Image from "next/image";
import iconNonStar from "@/assets/images/new-icon-star.svg";
import iconStar from "@/assets/images/new-icon-star1.svg";
import iconRank from "@/assets/images/new-icon-rank.png";
import iconView from "@/assets/images/new-icon-view.png";
import notFound from "@/assets/images/new-not-found.webp";
import logoX from "@/assets/images/new-logoX.svg";
import DonutChart from "@/components/Charts/DonutChart";
import DonutChartWinRate from "@/components/Charts/DonutChartWinRate";
import {
  convertTwitterLinkToHandle,
  convertDate,
  convertClickTwitterLink,
} from "@/utils";
import { tierIcons } from "@/pages/index";
import LineChart from "@/components/Charts/LineChartLP";
import LineChartMatch from "@/components/Charts/LineChartMatch";
import Carousel from "@/components/Carousel/Carousel";
import { Skeleton, SkeletonProfile } from "@/components/Skeleton/Skeleton";
import {removeFromLocalStorageArray, addToLocalStorageArray} from "@/utils/localStorage";

const mobileMenu = ["Info", "Ranked", "Coin", "Matches", "History"];

const tabRankView = (rank, view, loading) => {
  return (
    <div className="basis-[33%] flex flex-row items-center justify-center">
      <div className="flex flex-col items-center justify-end w-full">
        <div className="flex w-full items-center md:justify-end justify-start gap-1">
          <Image
            src={iconRank}
            alt="rank"
            width={24}
            height={24}
            className=""
          />
          <span className="font-semibold leading-relaxed text-white md:text-right text-left">
            RANK
          </span>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <span className="w-full md:text-right text-left text-3xl font-semibold leading-9 text-[#dcf808]">
            #{rank}
          </span>
        )}
      </div>
      <div className="flex flex-col items-center justify-end w-full">
        <div className="flex w-full items-center md:justify-end justify-start gap-1">
          <Image
            src={iconView}
            alt="rank"
            width={24}
            height={24}
            className=""
          />
          <span className="font-semibold leading-relaxed text-white md:text-right text-left ">
            VIEWS
          </span>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <span className="w-full md:text-right text-left text-3xl font-semibold leading-9 text-[#dcf808]">
            {view}
          </span>
        )}
      </div>
    </div>
  );
};

const Stats = ({profile, loading}) => {
    const router = useRouter();
    const [selectedStar, setSelectedStar] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileMode, setMobileMode] = useState(false);
    const [activeTab, setActiveTab] = useState("Info");
    const itemsPerPage = 4;

    const handleTabClick = (tab) => {
        setActiveTab(tab);
      };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setMobileMode(true);
                setActiveTab("Info");
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const { id: screenName } = router.query;


    useEffect(() => {
        if (!screenName) return;
        const startList = JSON.parse(localStorage.getItem("startList")) || [];
        if (startList.includes(screenName)) setSelectedStar(true)
        else setSelectedStar(false)
    }, [screenName, selectedStar]);

    const data =
        profile?.matchHistory?.map((item, index) => ({
            ...item,
            id: index + 1,
        })) || [];
    console.log(data);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(
        (profile?.matchHistory?.length || 0) / itemsPerPage
    );

    return (
        <>
        <div className="md:hidden flex items-center justify-between w-full border-b-[1px] border-[#202031]">
        {mobileMenu.map((item) => (
          <div
            key={item}
            className={`text-base font-medium leading-normal px-4 py-[6px] cursor-pointer ${
              activeTab === item
                ? "border-b-2 border-[#dcf808] text-[#08efe8]"
                : "text-[#8f8f9c]"
            }`}
            onClick={() => handleTabClick(item)}
          >
            {item}
          </div>
        ))}
      </div>

      {/* info Tab */}
      {activeTab === "Info" && mobileMode && (
        <div className="flex flex-col gap-4 bg-[#12121B] mt-6 rounded-lg p-2 w-[95%] border-[1px] border-[#202031] ">
          {tabRankView(profile.rank, profile.totalView, loading)}
          <div className=" flex justify-start gap-2 mt-[8px]">
            <Image src={logoX} alt="logoX" width={24} height={24} />
            <span className="text-[#08efe8] text-xl font-medium font-['Rubik'] leading-7">
              Lastest Tweets
            </span>
          </div>
          <Carousel latestTweet={profile?.latestTweet || []} />
          {/* {tabTwitter(profile?.profileLink|| "/logo.png", profile?.screenName, profile?.latestTweet?.[0]?.postURL, profile?.latestTweet?.[0]?.content)} */}
        </div>
      )}
        <div className="flex items-start md:justify-between justify-center md:gap-6 px-6 mt-6 min-[1440px]:px-[132px] w-full">
            {activeTab !== "Matches" && activeTab !== "History" && (
                <div className="flex-col flex gap-6 relative md:basis-[24%] w-[100%] md:max-w-[400px]">
                    {/* Ranked tab */}
                    {(activeTab === "Ranked" || activeTab === "No Hidden") && (
                        <div className="flex flex-col ">
                            <div className="md:block hidden z-10 bg-[#202031] mb-[-16px] w-fit rounded-lg  px-10 pt-[6px] pb-[24px] uppercase italic">
                                <span className="leading-6 text-lg font-[900] text-[#ffffff] inline-flex">
                                    RANKED
                                </span>
                            </div>
                            <div className="z-20 flex shadow-custom-top flex-col bg-[#171723] p-4 rounded-lg gap-4 border-[1px] border-[#202031]">
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
                                            Total Matches
                                        </span>
                                        {loading ? (
                                            <Skeleton css="start" />
                                        ) : (
                                            <span className="text-lg font-semibold text-white leading-relaxed w-full text-left">
                                                {profile?.win + profile?.lose}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center justify-start p-2 rounded-lg bg-[#0D0D15]">
                                        <span className="text-sm font-normal text-[#8f8f9c] leading-tight w-full text-left">
                                            Highest LP
                                        </span>
                                        {loading ? (
                                            <Skeleton css="start" />
                                        ) : (
                                            <span className="text-lg font-semibold text-white leading-relaxed w-full text-left">
                                                {profile?.highestLP}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center justify-start p-2 rounded-lg bg-[#0D0D15]">
                                        <span className="text-sm font-normal text-[#8f8f9c] leading-tight w-full text-left">
                                            Win/Lose
                                        </span>
                                        {loading ? (
                                            <Skeleton css="start" />
                                        ) : (
                                            <span className="text-lg font-semibold text-white leading-relaxed w-full text-left">
                                                {profile?.win}/{profile?.lose}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center justify-start p-2 rounded-lg bg-[#0D0D15]">
                                        <span className="text-sm font-normal text-[#8f8f9c] leading-tight w-full text-left">
                                            Win rate
                                        </span>
                                        {loading ? (
                                            <Skeleton css="start" />
                                        ) : (
                                            <span className="text-lg font-semibold text-white leading-relaxed w-full text-left">
                                                {(profile?.winRate * 100).toFixed(2)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Coin tab */}
                    {(activeTab === "Coin" || activeTab === "No Hidden") && (
                        <div className="flex flex-col">
                            <div className="md:block hidden z-10 bg-[#202031] mb-[-16px] w-fit from-[#08EF46] to-[#D3EC17] rounded-lg text-lg font-[900] text-[#ffffff] px-10 pt-[6px] pb-[24px] uppercase leading-6 italic">
                                coin referrence
                            </div>
                            <div className="z-20 flex flex-col bg-[#171723] p-4 rounded-lg gap-4 shadow-custom-top border-[1px] border-[#202031]">
                                <div className="flex flex-row justify-center gap-4">
                                    {<DonutChart tokenList={profile?.token || []} />}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="flex-col flex gap-6 flex-1 md:overflow-x-scroll">
                {(activeTab === "Matches" || activeTab === "No Hidden") && (
                    <div className="flex md:flex-row flex-col gap-6 overflow-x-scroll ">
                        {/* Match Tab */}
                        <div className="flex flex-col basis-[31%]">
                            <div className="z-10 bg-[#202031] mb-[-16px] w-fit  rounded-lg text-lg font-[900] text-[#ffffff] px-10 pt-[6px] pb-[24px] uppercase leading-6 italic">
                                RECENT 10 MATCHES
                            </div>
                            <div className="z-20 shadow-custom-top flex flex-col bg-[#171723] p-4 rounded-lg gap-4 border-[1px] border-[#202031]">
                                <span className="text-base font-normal text-[#8f8f9c] leading-normal">
                                    Show the results of the last 10 matches
                                </span>
                                <DonutChartWinRate
                                    data={(profile?.winRate * 100).toFixed(2) || []}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="z-10 bg-[#202031] mb-[-16px] w-fit rounded-lg text-lg font-[900] text-[#ffffff] px-10 pt-[6px] pb-[24px] uppercase leading-6 italic">
                                RECENT EARNINGS
                            </div>
                            <div className="z-20 shadow-custom-top flex flex-col bg-[#171723] p-4 rounded-lg h-full gap-4 border-[1px] border-[#202031]">
                                <span className="text-base font-normal text-[#8f8f9c] leading-normal">
                                    Show your recent 10 matches and their results
                                </span>
                                {console.log(profile?.recentMatches?.slice(0, 10))}
                                <LineChart
                                    recentMatches={profile?.recentMatches?.slice(0, 10) || []}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {/* History Tab */}
                {(activeTab === "History" || activeTab === "No Hidden") && (
                    <div className="flex flex-col overflow-x-scroll">
                        <div className="md:block hidden z-10 bg-[#202031] mb-[-16px] w-fit  rounded-lg text-lg font-[900] text-[#ffffff] px-10 pt-[6px] pb-[24px] uppercase leading-6 italic">
                            MATCH HISTORY
                        </div>
                        <div className="z-20 shadow-custom-top flex flex-col bg-[#12121B] p-4 rounded-lg gap-4 w-full ">
                            <span className="text-base font-normal text-[#8f8f9c] leading-normal">
                                Time to dust off the old scorebook! Check out the complete
                                match history.
                            </span>
                            {currentItems.length > 0 ? <>
                                <div className="flex flex-col gap-4 overflow-x-scroll ">
                                    {currentItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="  border-[1px] border-[#202031]  bg-[#171723] rounded-lg overflow-x-scroll "
                                        >
                                            <div className="min-w-[1100px] h-[150px] flex flex-row gap-4 items-center justify-between">
                                                <div
                                                    className={`h-full basis-[6%] rounded-l-lg text-center px-1 py-3 ${item.lp > 0 ? "bg-[#052e16]" : "bg-[#3C1919]"
                                                        }  flex items-center justify-center`}
                                                >
                                                    <span
                                                        className={` ${item.lp > 0 ? "text-[#08ef45]" : "text-[#FF796C]"
                                                            } text-base font-bold leading-normal inline-block rotate-90`}
                                                    >
                                                        {item.lp > 0 ? "WIN" : "LOSE"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col basis-[20%] gap-2  items-center justify-center">
                                                    <div className="flex items-center justify-start gap-[6px] w-full">
                                                        <Image
                                                            src={item?.avatar}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-lg border-[1px] border-white"
                                                        />
                                                        <span className="text-base text-white font-semibold leading-normal overflow-hidden text-ellipsis">
                                                            {item?.screenName}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-[#dcf808] font-semibold leading-tight text-left w-full">
                                                        vs
                                                    </span>
                                                    <div className="flex items-center justify-start gap-[6px] w-full">
                                                        <Image
                                                            src={item?.avatarOpponent === "NA" ? "" : item?.avatarOpponent}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-lg border-[1px] border-white"
                                                        />
                                                        <span
                                                            className="text-base text-white font-semibold leading-normal overflow-hidden text-ellipsis cursor-pointer"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/KOLinsight/${item?.screenNameOpponent}`
                                                                )
                                                            }
                                                        >
                                                            {item?.screenNameOpponent}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col basis-[14%] gap-3">
                                                    <div className="flex gap-[6px]">
                                                        <Image
                                                            src={item?.token?.icon}
                                                            width={46}
                                                            height={46}
                                                            alt="coin"
                                                            className=" rounded-full border-[1px] border-slate-800"
                                                        />
                                                        <div className="flex flex-col gap-[6px]">
                                                            <span className="text-white text-base font-medium leading-normal">
                                                                {item?.token?.coin}
                                                            </span>
                                                            <span className="text-[#8f8f9c] text-sm font-normal leading-tight">
                                                                {item?.token?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`bg-[#1D1D2D] px-3 py-[6px] ${item?.actionPrompt === "buy"
                                                            ? "border-[#08ef45] text-[#08ef45]"
                                                            : "text-[#e1584b] border-[#e1584b]"
                                                            }  border-[1px] rounded-[29px] text-base font-semibold text-center leading-normal`}
                                                    >
                                                        {item?.actionPrompt === "buy" ? "LONG" : "SHORT"}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start justify-between h-full rounded-lg p-2 basis-[35%]">
                                                    <div className="rounded-lg border-[1px] border-[#202031]">
                                                        <LineChartMatch
                                                            data={item?.data}
                                                            result={item.lp > 0}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className="text-xs font-normal text-[#8f8f9c] leading-none">
                                                            Match started: {convertDate(item?.data[0]?.time)}
                                                        </span>
                                                        <span className="text-xs font-normal text-[#8f8f9c] leading-none">
                                                            Match started:{" "}
                                                            {convertDate(
                                                                item?.data[item?.data.length - 1]?.time
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col basis-[13.6%]">
                                                    <span className="text-sm font-normal text-[#8f8f9c] leading-tight">
                                                        Estimated ROI
                                                    </span>
                                                    <span
                                                        className={`text-xl font-semibold ${item?.roi > 0
                                                            ? "text-[#dcf808] "
                                                            : "text-[#ffffff]"
                                                            } text-[#dcf808] leading-7`}
                                                    >
                                                        {item?.roi > 0 ? "+" : ""}
                                                        {item?.roi?.toFixed(2)}%
                                                    </span>
                                                    <span className="text-sm font-normal text-[#8f8f9c] leading-tight">
                                                        Earned LP
                                                    </span>
                                                    <span
                                                        className={`text-xl font-semibold ${item?.lp > 0
                                                            ? "text-[#dcf808] "
                                                            : "text-[#ffffff]"
                                                            } text-[#dcf808] leading-7`}
                                                    >
                                                        {item?.lp > 0 ? "+" : ""}
                                                        {item?.lp?.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end items-center mt-4 gap-[6px]">
                                    <span className="text-[16px] leading-6 font-[600] inline-flex text-center items-center">{`<`}</span>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-3 py-1 rounded-[4px] text-[16px] leading-6 font-[600] text-center ${currentPage === index + 1
                                                ? "bg-[#08efe8] text-[#0d0d15]"
                                                : "bg-transparent text-[#90909c]"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <span className="text-[16px] leading-6 font-[600] inline-flex text-center items-center">{`>`}</span>
                                </div>
                            </> : <div className="flex flex-col items-center justify-center h-full mt-16">
                                <Image src={notFound} alt="notfound" width={125} height={125} />
                                <span className="text-[16px] text-center leading-6 font-[500] text-[#90909C]">
                                    No matches found.
                                </span>
                                <span className="text-[16px] text-center leading-6 font-[500] text-[#90909C]">
                                    Try a hard refresh.
                                </span>
                            </div>

                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}

export default Stats