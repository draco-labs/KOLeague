import { postAsync } from "./request";

const marketService = {
  getCategories(params) {
    const url = `/api/Market/GetCategory`;
    return postAsync(url, params);
  },
  getCharts(params) {
    const url = `/api/Market/TokenPricePredict`;
    return postAsync(url, params);
  },
  getPools(params) {
    const url = `/api/Pool/GetPool`;
    return postAsync(url, params);
  },
  getAccounts(params) {
    const url = `/api/Authen/GetAccountInfo`;
    return postAsync(url, params);
  },
  updateAccount(params) {
    const url = `/api/Authen/AccountUpdate`;
    return postAsync(url, params);
  },
  getTwitterInfo(params) {
    const url = `/api/Authen/GetTwitterInfo`;
    return postAsync(url, params);
  },
  accountAuthen(params) {
    const url = `/api/Authen/AccountAuthen`;
    return postAsync(url, params);
  },
  getAccountLogPrice(params) {
    const url = `/api/Account/GetAccountLogPrice`;
    return postAsync(url, params);
  },
  sendTransaction(params) {
    const url = `/api/Market/SendTranSaction`;
    return postAsync(url, params);
  },
  poolParticipantINUP(params) {
    const url = `/api/Pool/PoolParticipantINUP`;
    return postAsync(url, params);
  },
  getPoolParticipant(params) {
    const url = `/api/Pool/GetPoolParticipant`;
    return postAsync(url, params);
  },
  getPoolHistory(params) {
    const url = `/api/Pool/GetPoolHistory`;
    return postAsync(url, params);
  },
  getPoolParticipantByUser(params) {
    const url = `/api/Account/GetPoolParticipantByUser`;
    return postAsync(url, params);
  },
  getAccountTrans(params) {
    const url = `/api/Account/GetAccountTrans`;
    return postAsync(url, params);
  },
  getAccountHold(params) {
    const url = `/api/Account/GetAccountHold`;
    return postAsync(url, params);
  },
  getAccountTopLeaderBoard(params) {
    const url = `/api/LeaderBoard/GetAccountTopLeaderBoard`;
    return postAsync(url, params);
  },
  getMe() {
    const url = `/api/Authen/GetMe`;
    return postAsync(url);
  },



  ///KOLeague
  getKOLRank(params) {
    const url = `/api/KOL/GetKOLRank`
    return postAsync(url, params);
  },

  getKOLInsight(params) {
    const url = `/api/KOL/GetKOLInsight`
    return postAsync(url, params);
  },

  viewLogInsert(params) {
    const url = `/api/KOL/ViewLogInsert`
    return postAsync(url, params);
  },




}

export default marketService;
