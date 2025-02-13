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
import { tierIcons } from "../index";
import LineChart from "@/components/Charts/LineChartLP";
import LineChartMatch from "@/components/Charts/LineChartMatch";
import Carousel from "@/components/Carousel/Carousel";
import { Skeleton, SkeletonProfile } from "@/components/Skeleton/Skeleton";
import {removeFromLocalStorageArray, addToLocalStorageArray} from "@/utils/localStorage";
import Stats from "@/components/KOL_Tab/stats";
import Calls from "@/components/KOL_Tab/calls";

const mobileMenu = ["Info", "Ranked", "Coin", "Matches", "History"];

const tabRankView = (rank, view, loading) => {
  return (
    <div className="basis-[33%] flex flex-row items-center justify-center">
      <div className="flex flex-col items-center justify-end w-full">
        <div className="flex w-full items-center md:justify-end justify-start gap-1">
          {/* <Image
            src={iconRank}
            alt="rank"
            width={24}
            height={24}
            className=""
          /> */}
          <span className="font-semibold text-[16px] leading-relaxed text-white md:text-right text-left">
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
          {/* <Image
            src={iconView}
            alt="rank"
            width={24}
            height={24}
            className=""
          /> */}
          <span className="font-semibold text-[16px] leading-relaxed text-white md:text-right text-left ">
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

const KOLinsights = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [selectedStar, setSelectedStar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMode, setMobileMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Info");
  const [loading, setLoading] = useState(false);
  const [selectTab, setSelectTab] = useState("stats");
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

  const fetchView = async () => {
      await marketService.viewLogInsert({
        screenName: screenName,
        userViewer: "",
        loginIP: "",
      });
    };

  const { id: screenName } = router.query;

  const getData = async (id) => {
    try {
      setLoading(true);
      const { data } = await marketService.getKOLInsight({
        "screenName": id,
        "page": 0
      });
      console.log("data", data.screenName);
      setProfile(data || {});
      setLoading(false);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (!screenName) return;
    fetchView()
    getData(screenName);
  },[screenName])
  useEffect(() => {
    if (!screenName) return;
    const startList = JSON.parse(localStorage.getItem("startList")) || [];
    if (startList.includes(screenName)) setSelectedStar(true)
      else setSelectedStar(false)
  }, [screenName, selectedStar]);


  return (
    <div className="flex flex-col items-center md:justify-center justify-start overflow-x-hidden w-full h-full">
      <div className="md:h-[344px] h-[150px] bg-backdrop-gradient1 bg-cover bg-no-repeat bg-center flex flex-row gap-12 items-start justify-between w-full 2xl:px-[132px] lg:pt-[71px] md:px-6 md:pt-[25px] px-5">
        {/* Profile Tab */}
        <div
          className="top-0 flex flex-row gap-12   items-center justify-between w-full  bg-transparent md:bg-[#3C3C46] md:bg-opacity-0 md:backdrop-blur-[52.7px] p-4 rounded-lg"
          style={{
            backgroundImage: `repeating-linear-gradient(
            135deg,
            transparent,
            transparent 0.5px,
            rgba(0,0,0,0.3) 1px,
            rgba(0,0,0,0.05) 2px
          )`,
          }}
        >
          <div className="flex-1 flex md:flex-row md:gap-0 gap-4 flex-col justify-start md:items-center md:justify-between ">
            <div className="flex md:items-center items-start md:justify-center justify-start gap-[17px]">
              {loading ? (
                <div className="loader-squares rounded-lg md:w-[183px] md:h-[183px] w-[70px] h-[70px] border-[1px] border-white"></div>
              ) : (
                <Image
                  src={profile?.profileLink || "/logo.png"}
                  alt="avatar"
                  width={150}
                  height={150}
                  className=" rounded-lg md:w-[150px] md:h-[150px] w-[70px] h-[70px] border-[1px] border-white"
                />
              )}
              {loading ? (
                <SkeletonProfile />
              ) : (
                <div className="flex flex-col md:gap-2">
                  <div className="flex items-center justify-start gap-2">
                    <span className="text-[32px] font-[600] md:leading-0 leading-[38px]">
                      {profile?.screenName}
                    </span>
                    <Image
                      src={selectedStar ? iconStar : iconNonStar}
                      alt="star"
                      width={30}
                      height={30}
                      onClick={() => {
                        if (!selectedStar) {
                          addToLocalStorageArray("startList", profile?.screenName);
                        } else {
                          removeFromLocalStorageArray("startList", profile?.screenName);
                        }
                        setSelectedStar(!selectedStar)}}
                    />
                  </div>

                  <div
                    className="text-[16px] leading-6 font-[500] text-[#08EFE8] pb-[9px] cursor-pointer "
                    onClick={() =>
                      window.open(
                        convertClickTwitterLink(
                          profile?.latestTweet?.[0]?.postURL
                        ),
                        "_blank"
                      )
                    }
                  >
                    {convertTwitterLinkToHandle(
                      profile?.latestTweet?.[0]?.postURL
                    )}
                  </div>
                  <div className=" md:flex hidden items-center justify-start gap-1">
                    {profile?.token?.map(
                      (item, index) =>
                        item?.icon && (
                          <Image
                            key={index}
                            src={item?.icon}
                            width={24}
                            height={24}
                            alt={`token-${index}`}
                            className="rounded-full"
                          />
                        )
                    ) || null}
                  </div>
                </div>
              )}
            </div>
            <div className=" md:hidden flex items-center justify-start gap-1">
              {profile?.token?.map(
                (item, index) =>
                  item?.icon && (
                    <Image
                      key={index}
                      src={item?.icon}
                      width={24}
                      height={24}
                      alt={`token-${index}`}
                      className="rounded-full"
                    />
                  )
              ) || null}
            </div>
            {!mobileMode &&
              tabRankView(profile.rank, profile.totalView, loading)}
          </div>
          {!mobileMode && <Carousel latestTweet={profile?.latestTweet || []} />}
        </div>
      </div>
      <div className="w-full md:px-[132px] px-4" >
        <div className="flex bg-[#171723] p-1 gap-1 items-center justify-center md:w-[426px] w-full rounded-lg border-[1px] border-[#202031]">
          <div className={`uppercase px-8 w-full rounded-lg py-[6px] text-base font-bold cursor-pointer leading-normal text-center ${selectTab === "stats" ? "bg-[#08EFE8] text-[#0D0D15]" : ""}`} onClick={() => setSelectTab('stats')}>stats</div>
          <div className={`relative group px-8 w-full rounded-lg py-[6px] text-base font-bold leading-normal text-center ${selectTab === "calls" ? "bg-[#08EFE8] text-[#0D0D15]" : ""} ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`} onClick={() => !loading && setSelectTab('calls')} disabled={loading}>
            CALLS
            {loading &&
              <div className="absolute hidden top-[-50px] sleft-[10px] p-[4px] rounded-[8px] group-hover:block bg-black shadow-lg border-[1px] border-[#555] text-[#FAFAFA] mt-[12px] text-left text-xs font-medium leading-tight">
                Loading...
              </div>
            }
          </div>
        </div>
      </div>

      {selectTab === 'stats' && <Stats profile={profile} loading={loading} />}
      {selectTab === 'calls' && <Calls profile={profile} loading={loading} />}
      <div className="h-[100px]" />
    </div>
  );
};

export default KOLinsights;
