/* eslint-disable no-unused-vars */
export const MAP_CLASS = "map__button-select";
export const CAR_COLLECTION_CLASS = "car__collection-select";
export const CAR_CUSTOMIZATION_CLASS = "car__customization-select";
export const NEWS_CLASS = "news__button-select";
export const DOWNLOAD_CLASS = "download__button-select";
export const APPSTORE_CLASS = "appstore__button-select";
export const APK_CLASS = "apk__button-select";
export const CH_CLASS = "ch_button-select";
export const SUPPORT_CLASS = "support__button-select";
export const HISTORY_CHAT = "history_chat";

export const RECORDS_PER_PAGE = 10;

export const navLink = [
  {
    id: 1,
    name: "CAR COLLECTION",
    elId: "collec",
    class: CAR_COLLECTION_CLASS,
  },
  {
    id: 2,
    name: "MAPS",
    elId: "map",
    class: MAP_CLASS,
  },
  {
    id: 3,
    name: "CAR CUSTOMIZATION",
    elId: "car-custom",
    class: CAR_CUSTOMIZATION_CLASS,
  },
  {
    id: 4,
    name: "NEWS",
    elId: "new",
    paths: ["/new", "[slug]"],
    class: NEWS_CLASS,
  },
  {
    id: 5,
    name: "DOWNLOAD",
    elId: "download",
    class: DOWNLOAD_CLASS,
  },
];

export const tabs = [
  {
    status: 0,
    title: "All Users",
  },
  {
    status: 1,
    title: "NFT Holders",
  },
  {
    status: 2,
    title: "New Users",
  },
  {
    status: 3,
    title: "Uploaded Addresses",
  },
];

export const mapQuestStatus: any = {
  0: "Ongoing",
  1: "Scheduled",
  2: "Draft",
  3: "Completed",
  4: "Hidden",
  5: "Deleted",
};

export const listSocialMedia = [
  {
    id: 1,
    field: "discord",
    img: "/images/Component 17.png",
    value: "",
  },
  {
    id: 2,
    field: "website",
    img: "/images/Component 17 (5).png",
    value: "",
  },
  {
    id: 3,
    field: "github",
    img: "/images/Component 17 (2).png",
    value: "",
  },
  {
    id: 4,
    field: "medium",
    img: "/images/Component 17 (6).png",
    value: "",
  },
  {
    id: 5,
    field: "telegram",
    img: "/images/Component 17 (3).png",
    value: "",
  },
  {
    id: 6,
    field: "facebook",
    img: "/images/Component 17 (7).png",
    value: "",
  },
  {
    id: 7,
    field: "youtube",
    img: "/images/Component 17 (4).png",
    value: "",
  },
  {
    id: 8,
    field: "tiktok",
    img: "/images/Component 17 (8).png",
    value: "",
  },
];

export const selectFilter = [
  {
    id: -1,
    statusFilter: -1,
    title: "All",
  },
  {
    id: 0,
    statusFilter: 0,
    title: "Active",
  },
  {
    id: 1,
    statusFilter: 1,
    title: "Upcoming",
  },
  {
    id: 2,
    statusFilter: 3,
    title: "Ended",
  },
  {
    id: 3,
    statusFilter: 2,
    title: "Draft",
  },
  // {
  //   id: 4,
  //   statusFilter: 5,
  //   title: 'Deleted'
  // }
];

export const selectFilterDetailProduct = [
  {
    id: -1,
    statusFilter: -1,
    title: "All",
  },
  {
    id: 0,
    statusFilter: 0,
    title: "Active",
  },
  {
    id: 1,
    statusFilter: 1,
    title: "Upcoming",
  },
  {
    id: 2,
    statusFilter: 3,
    title: "Ended",
  },
  {
    id: 3,
    statusFilter: 2,
    title: "Draft",
  },
  {
    id: 4,
    statusFilter: 5,
    title: "Deleted",
  },
];

export const tabMyProfile = [
  {
    id: 0,
    title: "My NFTs",
  },
  {
    id: 2,
    title: "My Following",
  },
  {
    id: 1,
    title: "Settings",
  },
];

export const tabProductDetail = [
  {
    id: 0,
    title: "Overview",
  },
  {
    id: 1,
    title: "Review",
  },
  {
    id: 2,
    title: "Campaigns",
  },
  {
    id: 3,
    title: "Changelog",
  },
  {
    id: 4,
    title: "Feature Requests ",
  },
];

export const selectVerify = [
  //   {
  //     id: 0,
  //     title: 'All'
  //   },
  {
    id: 1,
    title: "Verify",
    value: "1",
  },
  {
    id: 2,
    title: "Not verify",
    value: "0",
  },
];

export const selectVerifyProduct = [
  {
    id: 0,
    title: "All",
    value: "0",
  },
  {
    id: 1,
    title: "Verify",
    value: "1",
  },
  {
    id: 2,
    title: "Followed",
    value: "2",
  },
];

export const selectCategories = [
  {
    id: 0,
    title: "Categories",
  },
];

export const VENOM_RPC_NODE = "https://jrpc-testnet.venom.foundation/rpc";

export const CONTRACT_DEPLOY =
  "0:dae7521f2ba452f6910431be48b0b7d5c20e2c12d9988b48b7faa4d2d1298883";

export enum NetworkTypeEnum {
  VENOM = 13,
  BASE = 14,
  BLAST_MAINNET = 15,
  BLAST = 16,
}

export const CHAIN_NAME_BY_ID = {
  [NetworkTypeEnum.VENOM]: "Venom",
  [NetworkTypeEnum.BASE]: "Base",
  [NetworkTypeEnum.BLAST_MAINNET]: "Blast Mainnet",
  [NetworkTypeEnum.BLAST]: "Blast",
};

export const SIGN_MESSAGE =
  "Welcome to Grinding. By signing this message, you agree with our Terms and Conditions.";

// mainnet
// export const CONTRACT_DEPLOY_BLAST =
//   "0xD8d1E4Fd8b8D68b5A5a345ed97EF06A5CcbC8C2f";

export const CONTRACT_DEPLOY_BLAST =
  // main
  // "0xD8d1E4Fd8b8D68b5A5a345ed97EF06A5CcbC8C2f";
  // test
  "0xba382EF7d9F3a6860D335853Ea7E093665907F66";

export const CONTRACT_FACTORY_TOKEN_BLAST =
  // "0x115D81e07f4cd78E4a4191286243436D20842b67";
  "0xf2073a2e6A0ADFEC6FE9cC05ad2aB73C478682a5";

export const CHAIN_TYPE_KEY = "activeChain";

export const selectNetwork = [
  // {
  //   id: 0,
  //   title: "All",
  //   value: "0",
  // },
  // {
  //   id: 1,
  //   title: "VENOM",
  //   value: NetworkTypeEnum.VENOM,
  // },
  {
    id: 2,
    title: "BLAST",
    value: NetworkTypeEnum.BLAST,
  },
];
