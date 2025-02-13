import axios from "axios";
import { DEXSCREENER_API_URL } from "../constant";

export const getTokenDataByTokenAddress = async (tokenAddress: string) => {
  const res = await axios.get(
    `${DEXSCREENER_API_URL}latest/dex/tokens/${tokenAddress}`
  );
  const { data } = res;
  if (data?.pairs) {
    const pair = data?.pairs?.[0];
    return {
      ...pair?.baseToken,
      ...pair?.info,
    };
  }
  return null;
};

export const getTokenDataByName = async () => {};
