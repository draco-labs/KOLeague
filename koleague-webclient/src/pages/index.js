import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import meme1 from "@/assets/images/new-meme1.svg";
import meme2 from "@/assets/images/new-meme2.svg";
import marketWizards from "@/assets/images/new-market-wizards.png";
import logoLeaderboard from "@/assets/images/new-logo-leaderboard.svg";
import iconArrow from "@/assets/images/new-icon-arrow.svg";
import iconReset from "@/assets/images/new-icon-reset.svg";
import iconRank1 from "@/assets/images/new-icon-rank1.svg";
import iconRank2 from "@/assets/images/new-icon-rank2.svg";
import iconRank3 from "@/assets/images/new-icon-rank3.svg";
import iconRank4 from "@/assets/images/new-icon-rank4.svg";
import iconRank5 from "@/assets/images/new-icon-rank5.svg";
import iconRank6 from "@/assets/images/new-icon-rank6.svg";
import iconRank7 from "@/assets/images/new-icon-rank7.svg";
import notFound from "@/assets/images/new-not-found.webp";
import iconBTC from "@/assets/images/new-icon-BTC.svg";
import iconETH from "@/assets/images/new-icon-ETH.svg";
import iconSOL from "@/assets/images/new-icon-SOL.svg";
import iconSUI from "@/assets/images/new-icon-SUI.svg";
import avatar from "@/assets/images/new-avatar-template.png";
import iconRecently from "@/assets/images/new-icon-recently.svg";
import iconUp from "@/assets/images/new-icon-up.svg";
import iconDown from "@/assets/images/new-icon-down.svg";
import iconNew from "@/assets/images/new-icon-new.svg";
import iconNone from "@/assets/images/new-icon-none.svg";
import iconTrend from "@/assets/images/new-icon-trend.svg";
import marketService from "@/services/market.service";
import { SkeletonRow } from "@/components/Skeleton/Skeleton";
import { useRouter } from "next/router";
import {
  convertTwitterLinkToHandle,
  convertTokenList,
  convertClickTwitterLink,
} from "@/utils";
import useDebounce from "@/hooks/useDebounce";
import useOnClickOutside from "@/hooks/useClickOutSide";
import { handleFocus, handleScreenNameClick } from "@/utils/indexedDB";
import useResponsive from "@/hooks/useResponsive";

const dataFilter = [
  {
    id: 1,
    label: "Bronze",
    src: iconRank1,
  },
  { id: 2, label: "Silver", src: iconRank2 },
  { id: 3, label: "Gold", src: iconRank3 },
  { id: 4, label: "Platinum", src: iconRank4 },
  { id: 5, label: "Diamond", src: iconRank5 },
  { id: 6, label: "Master", src: iconRank6 },
  { id: 7, label: "Grandmaster", src: iconRank7 },
];

const dataSort = ["Rank", "Win Rate", "Matches"];
export const tierIcons = {
  Bronze: iconRank1,
  Silver: iconRank2,
  Gold: iconRank3,
  Platinum: iconRank4,
  Diamond: iconRank5,
  Master: iconRank6,
  Grandmaster: iconRank7,
};


const Page = () => {
  const router = useRouter();
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Rank");
  const [selectProfile, setSelectProfile] = useState();
  const [resetAnimation, setResetAnimation] = useState(false);
  const [dataRank, setDataRank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const sorterRef = useRef(null);
  const filterRef = useRef(null);
  const searchRef = useRef(null);
  const responsive = useResponsive();

  // Gọi hooks bên ngoài useEffect
  useOnClickOutside(sorterRef, () => setOpenSort(false));
  useOnClickOutside(filterRef, () => setOpenFilter(false));
  useOnClickOutside(searchRef, () => setIsInputFocused(false));

  const inputDebouce = useDebounce(search, 1000);

  const fetchUsers = async () => {
    const users = await handleFocus();
    setRecentUsers(users);
    setIsInputFocused(true);
    console.log("Fetched users:", users);
    console.log(recentUsers, isInputFocused, recentUsers.length > 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sortValue =
          selectedSort === "Rank" ? -1 : selectedSort === "Win Rate" ? 2 : 3;
        const filter = selectedFilters.join(",");
        console.log("first,", filter);
        const response = await marketService.getKOLRank(
          {
            screenName: inputDebouce,
            limit: 20,
            sort: sortValue,
            lpRankID: filter,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response?.data?.data;
        setDataRank(data);
        console.log("data", data);
        setLoading(false);
        console.log("dataRank", dataRank);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedSort, inputDebouce, selectedFilters]);

  const handleSortClick = (sortOption) => {
    setSelectedSort(sortOption);
    setOpenSort(false);
  };

  const handleCheckboxChange = (id) => {
    setSelectedFilters((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((filterId) => filterId !== id)
        : [...prevSelected, id]
    );
  };

  const handleReset = () => {
    setSelectedFilters([]);
    setResetAnimation(true);
    setTimeout(() => setResetAnimation(false), 1000);
  };
  return (
    <div className="flex flex-col min-h-[90vh]">
      <div className="md:h-[384px] h-[340px]  bg-backdrop-gradient bg-cover bg-no-repeat bg-center relative md:mt-10 flex items-start justify-center ">
        <div className="relative flex flex-col items-center justify-center w-fit pt-5 ">
          <Image src={logoLeaderboard} alt="logoLeaderboard" />
          <span className="relative z-20 text-center text-[#08EFE8] text-lg font-semibold  leading-7 pt-6 pb-2">
            LEADERBOARD
          </span>
          <div className="relative z-20 md:w-[439px] w-[292px] md:h-[136px] h-[91px]">
            <Image
              src={marketWizards}
              width={439}
              height={136}
              alt="marketWizards"
            />
          </div>
          <span className="text-center text-zinc-400 text-sm font-medium leading-tight pt-[11px] md:p-0 px-6">
            {" "}
            If you don't see yourself in the league, join our Telegram to
            complain.
          </span>
          <div className="absolute md:-bottom-[43px] md:-right-[7rem] bottom-[10px] right-0  z-10">
            <Image src={meme1} alt="meme1" />
          </div>
          <div className="absolute md:top-4 md:-left-[10rem] top-7 -left-[2.5rem] z-30 md:w-full w-[180px]">
            <Image src={meme2} alt="meme2" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#0d0d15] from-85% to-[#22114A] w-full h-full flex flex-col items-center justify-start p-2">
        <div className=" min-[800px]:w-[800px] w-full flex md:flex-row flex-col gap-3 ">
          <div className="gap-3 basis-[38.5%] flex w-full ">
            <div ref={filterRef}
              className={`${openFilter
                ? "border-[#dcf808] border-[1px]"
                : "border-[#1D1D2D] border-[1px]"
                } relative h-12 md:px-0 px-5 basis-2/5 py-3 bg-[#1D1D2D] rounded-lg sm:justify-center justify-start items-center gap-1 inline-flex`}
            >
              <div
                className="flex  sm:justify-center justify-start gap-1"
                onClick={() => {
                  if (openSort) setOpenSort(false);
                  setOpenFilter(!openFilter);
                }}
              >
                <div
                  className={` ${selectedFilters.length ? "text-[#08EF46]" : "text-zinc-400"
                    } text-base w-[57px] font-medium leading-normal cursor-pointer text-right`}
                >
                  {`Filter${selectedFilters.length > 0
                    ? `(${selectedFilters.length})`
                    : ""
                    }`}
                </div>
                <div className=" relative flex items-center cursor-pointer">
                  <Image
                    src={iconArrow}
                    alt="iconArrow"
                    width={24}
                    height={12}
                    className={`transition-transform duration-500 ${openFilter ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </div>
              </div>

              {openFilter && responsive.width > 768 && (
                <div
                  //ref={filterRef}
                  className="absolute hidden md:flex top-14 left-0 w-[264px] flex-col items-center justify-start z-30 bg-[#171723] rounded-lg"
                >
                  <div className="p-2 flex justify-between w-full bg-[#202031] rounded-t-lg">
                    <div>
                      <span
                        className={` ${selectedFilters.length
                          ? "text-[#08EF46]"
                          : "text-neural-50"
                          } text-base font-medium leading-normal`}
                      >
                        {`Filter${selectedFilters.length > 0
                          ? `(${selectedFilters.length})`
                          : ""
                          }`}
                      </span>
                    </div>
                    <div
                      className="flex gap-[6px] items-center justify-center cursor-pointer"
                      onClick={handleReset}
                    >
                      <Image
                        src={iconReset}
                        alt="iconReset"
                        className={`transition-transform duration-1000 ${resetAnimation ? "rotate-360" : ""
                          }`}
                      />
                      <span className="text-neural-50 text-sm font-medium leading-tight">
                        Reset
                      </span>
                    </div>
                  </div>
                  {dataFilter.map((item, index) => (
                    <div className=" flex items-center justify-start p-2 w-full hover:bg-[#202031]">
                      <div className="checkbox-wrapper-30">
                        <span className="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                          <svg>
                            <use
                              xlinkHref="#checkbox-30"
                              className="checkbox"
                            ></use>
                          </svg>
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "none" }}
                        >
                          <symbol id="checkbox-30" viewBox="0 0 22 22">
                            <path
                              fill="none"
                              stroke=""
                              d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                            />
                          </symbol>
                        </svg>
                      </div>
                      <Image src={item.src} alt={`iconRank${item.id}`} />
                      <span className="text-neural-100 text-base font-medium leading-normal">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* Mobile Filter */}
              {
                <div //ref={filterRef}
                  className={`fixed h-fit w-full z-[100] md:hidden bottom-0 right-0 transition-transform duration-500 ${openFilter ? "translate-y-0" : "translate-y-full"
                    }`}
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 46%, rgba(3, 94, 91, 0.6) 100%)",
                  }}
                >
                  <div className="p-2 flex justify-between w-full bg-[#202031] rounded-t-lg">
                    <div>
                      <span
                        className={` ${selectedFilters.length
                          ? "text-[#08EF46]"
                          : "text-neural-50"
                          } text-base font-medium leading-normal`}
                      >
                        {`Filter${selectedFilters.length > 0
                          ? `(${selectedFilters.length})`
                          : ""
                          }`}
                      </span>
                    </div>
                    <div
                      className="flex gap-[6px] items-center justify-center cursor-pointer"
                      onClick={handleReset}
                    >
                      <Image
                        src={iconReset}
                        alt="iconReset"
                        className={`transition-transform duration-1000 ${resetAnimation ? "rotate-360" : ""
                          }`}
                      />
                      <span className="text-neural-50 text-sm font-medium leading-tight">
                        Reset
                      </span>
                    </div>
                  </div>
                  {dataFilter.map((item, index) => (
                    <div className=" flex items-center justify-start p-2 w-full hover:bg-[#202031]">
                      <div className="checkbox-wrapper-30">
                        <span className="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                          <svg>
                            <use
                              xlinkHref="#checkbox-30"
                              className="checkbox"
                            ></use>
                          </svg>
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "none" }}
                        >
                          <symbol id="checkbox-30" viewBox="0 0 22 22">
                            <path
                              fill="none"
                              stroke=""
                              d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                            />
                          </symbol>
                        </svg>
                      </div>
                      <Image src={item.src} alt={`iconRank${item.id}`} />
                      <span className="text-neural-100 text-base font-medium leading-normal">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              }
            </div>
            <div ref={sorterRef}
              className={`relative h-12 basis-4/5 py-3 bg-[#1D1D2D] cursor-pointer rounded-lg justify-start items-center gap-3 inline-flex ${openSort
                ? "border-[#dcf808] border-[1px]"
                : "border-[#1D1D2D] border-[1px]"
                }`}
              onClick={() => {
                setOpenFilter(false);
                setOpenSort(!openSort);
              }}
            >
              <div className="justify-center gap-1 w-full items-center flex ">
                <div className="text-zinc-400 text-base font-medium  leading-normal">
                  Sort by:{" "}
                  <span className=" text-neutral-50 text-base font-medium leading-normal">
                    {selectedSort}
                  </span>
                </div>
                <div className=" relative flex items-center cursor-pointer">
                  <Image
                    src={iconArrow}
                    alt="iconArrow"
                    width={24}
                    height={12}
                    className={`transition-transform duration-500 ${openSort ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </div>
              </div>
              {openSort && (
                <div
                  // ref={sorterRef}
                  className="absolute top-14 left-0 hidden md:flex flex-col w-[170px] items-center justify-start bg-[#171723] rounded-lg z-20"
                >
                  {dataSort.map((item, index) => (
                    <span
                      className={`w-full p-2 text-left text-neural-100 text-base font-medium leading-normal hover:z-10 ${selectedSort == item ?" cursor-not-allowed" : " "} hover:bg-[#202031] `}
                      onClick={() => {
                        if (selectedSort !== item) handleSortClick(item);
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Mobile Sort */}
              <div 
                className={`fixed h-fit w-full z-[100] md:hidden bottom-0 right-0 transition-transform duration-500 flex flex-col items-center justify-start ${openSort ? "translate-y-0" : "translate-y-full"
                  }`}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 46%, rgba(3, 94, 91, 0.6) 100%)",
                }}
              >
                {dataSort.map((item, index) => (
                  <span
                    className="w-full p-2 text-left text-neural-100 text-base font-medium leading-normal hover:z-10 hover:bg-[#202031]"
                    onClick={() => handleSortClick(item)}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            tabIndex="0"
            className=" relative flex-1 bg-[#1D1D2D] rounded-lg justify-start items-center inline-flex"
          >
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsInputFocused(false);
              }}
              onFocus={fetchUsers}
              //onBlur={handleBlur}
              className="pl-5  py-[14px] w-full h-full text-zinc-400 text-base font-medium border-none bg-transparent leading-normal"
            />
            {isInputFocused && recentUsers.length > 0 && (
              <div
                ref={searchRef}
                className="absolute top-full left-0 bg-[#0d0d15] border-[1px] border-[#202031] w-full flex flex-col gap-4 rounded-lg shadow-md mt-3 p-4 z-10"
              >
                <div className="flex gap-2 ">
                  <Image
                    src={iconTrend}
                    height={24}
                    width={24}
                    alt="iconTrend"
                  />
                  <span className="text-[#dcf808] text-2xl font-medium leading-4">
                    Recently
                  </span>
                </div>
                <div
                  className={`grid w-full grid-cols-${recentUsers.length > 1 ? "2" : "1"
                    } gap-2`}
                >
                  {console.log(recentUsers)}
                  {recentUsers
                    .slice()
                    .reverse()
                    .map((user, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 w-full hover:bg-[#1d1d2d] bg-[#171723] rounded-lg text-white text-base flex gap-3 items-center justify-start"
                      // onClick={() => {
                      //   setSearch(user);
                      //   }}
                      >
                        <Image
                          src={user?.avatarUrl || avatar}
                          width={56}
                          height={56}
                          className="rounded-full cursor-pointer basis-[50px]"
                          alt={"avatar"}
                          onClick={() =>
                            router.push(`/KOLinsight/${user?.screenName}`)
                          }
                        />
                        <div className="flex flex-col flex-1 ">
                          <span
                            className="text-white text-base min-[475px]:max-w-full max-w-[90px]  inline-block font-semibold cursor-pointer leading-normal overflow-hidden text-ellipsis"
                            onClick={() => {
                              handleScreenNameClick(
                                user?.screenName,
                                user?.avatarUrl,
                                user?.twitterUrl
                              );
                              router.push(`/KOLinsight/${user?.screenName}`);
                            }}
                          >
                            {user?.screenName}
                          </span>
                          <span
                            className="text-sm font-semibold cursor-pointer sm:max-w-full max-w-[80px]  inline-block text-[#08efe8] leading-tight overflow-hidden text-ellipsis"
                            onClick={() =>
                              window.open(
                                convertClickTwitterLink(user?.twitterUrl),
                                "_blank"
                              )
                            }
                          >
                            {convertTwitterLinkToHandle(user?.twitterUrl)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className=" overflow-x-scroll w-full">
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </div>
        ) : dataRank?.length > 0 ? (
          <div className="w-full overflow-x-scroll mt-10">
            <div className="w-full  min-w-[1600px]">
              <div className="text-[14px] leading-5 font-[600] text-[#90909C] text-left flex items-center justify-center w-full md:px-[108px] px-8 py-2">
                <div className="basis-[6%]">RANK</div>
                <div className="basis-[18%]">KOL</div>
                <div className="basis-[20%] pl-2">TIER</div>
                <div className="basis-[9%]">LP</div>
                <div className="basis-[20%]">MOST PLAYED COINS</div>
                <div className="basis-[15%]">WIN RATE</div>
                <div className="text-right flex-1">MATCHES</div>
              </div>
              <div className="w-full md:px-20 px-4 ">
                {dataRank?.map((item) => (
                  <div
                    key={item.logID}
                    className={` ${selectProfile === item.logID ? "bg-[#161620]" : ""
                      } border-y-[1px] w-full border-[#202031] flex items-center justify-start px-6 py-2 cursor-pointer`}
                    onClick={() => setSelectProfile(item.logID)}
                  >
                    <div className=" basis-[6%] flex gap-[10px]">
                      <div
                        className={
                          item.rankOrd <= 3
                            ? "text-shadow-custom-white text-[24px] left-6 font-[600] "
                            : "text-[#ADADBC] text-[18px] left-6 font-[600] leading-6"
                        }
                      >
                        {item.rankOrd}
                      </div>
                      <div>
                        {" "}
                        <Image
                          src={iconUp}
                          width={24}
                          height={24}
                          alt="iconUp"
                        />{" "}
                      </div>
                    </div>
                    <div className="flex gap-3 items-center basis-[18%] justify-start ">
                      <Image
                        src={item.profileUrl || "/logo.png"}
                        width={56}
                        height={56}
                        className="rounded-full"
                        alt={item.screenName}
                        onClick={() =>
                          router.push(`/KOLinsight/${item?.screenName}`)
                        }
                      />
                      <div className="flex flex-col">
                        <span
                          className="text-white text-base font-semibold leading-normal"
                          onClick={() => {
                            handleScreenNameClick(
                              item?.screenName,
                              item?.profileUrl,
                              item?.twitterLink
                            );
                            router.push(`/KOLinsight/${item?.screenName}`);
                          }}
                        >
                          {item.screenName}
                        </span>
                        <span
                          className="text-sm font-semibold text-[#08efe8] leading-tight"
                          onClick={() =>
                            window.open(
                              convertClickTwitterLink(item.twitterLink),
                              "_blank"
                            )
                          }
                        >
                          {convertTwitterLinkToHandle(item.twitterLink)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1 basis-[20%] items-center justify-start ">
                      <Image
                        src={tierIcons[item.lpRankName] || iconRank1}
                        width={62}
                        height={38}
                        alt="rank"
                      />
                      <span className="text-white text-base font-semibold leading-normal ">
                        {item.lpRankName || "Secret"}
                      </span>
                    </div>

                    <div className="flex items-center basis-[9%]">
                      <span className="text-[#dcf808] text-lg font-semibold leading-3">
                        {item.elo}
                      </span>
                    </div>

                    <div className="flex gap-1 basis-[20%]">
                      {convertTokenList(item.tokenIconList).map(
                        (token, index) => (
                          <Image
                            key={index}
                            src={token}
                            width={24}
                            height={24}
                            alt={`token-${index}`}
                            className="rounded-full"
                          />
                        )
                      )}
                    </div>

                    <div className=" basis-[15%]">
                      <div className="flex items-center justify-start gap-[1px] w-full rounded-full h-5 ">
                        <div className="basis-1/5 rounded-l-full bg-[#DCF808] h-full">
                          <span className="text-[14px] leading-5 font-[600] text-[#0D0D15] pl-2 text-center inline-flex">
                            {(item.winRate * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="basis-4/5 bg-gray-800 rounded-r-full h-full">
                          <div
                            className="bg-[#DCF808] h-full rounded-r-full flex items-center justify-center"
                            style={{ width: `${item.winRate * 100}%` }}
                          >
                            <span className="text-[14px] leading-5 font-[600] text-[#0D0D15] hidden">
                              hehe
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" text-right text-[#DCF808] text-[18px] leading-6 font-[600] flex-1">
                      {item.totalMatch}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full mt-16">
            <Image src={notFound} alt="notfound" width={125} height={125} />
            <span className="text-[16px] text-center leading-6 font-[500] text-[#90909C]">
              No matches found.
            </span>
            <span className="text-[16px] text-center leading-6 font-[500] text-[#90909C]">
              Try a hard refresh.
            </span>
          </div>
        )}
        <div className="h-[100px]"/>
      </div>
      
    </div>
  );
};

export default Page;
