import { Contract } from "starknet";
import ERC20 from "./StarknetErc20.json";
import { provider } from "./swap";
import axios from "axios";

export const getTokenBalance = async (
  tokenAddress,
  accountAddress,
  // provider
) => {
  const tokenContract = new Contract(ERC20, tokenAddress, provider);
  const balance = await tokenContract?.balanceOf(accountAddress);
  return Number(balance?.balance?.low);
};

export const DEXSCREENER_API_URL = "https://api.dexscreener.com/";

export const getTokenDataByTokenAddress = async (tokenAddress) => {
  const res = await axios.get(
    `${DEXSCREENER_API_URL}latest/dex/tokens/${tokenAddress}`
  );
  const { data } = res;
  console.log('data', data)
  if (data?.pairs) {
    const pair = data?.pairs?.[0];
    return {
      ...pair?.baseToken,
      ...pair?.info,
      priceUsd: pair?.priceUsd,
    };
  }
  return null;
};