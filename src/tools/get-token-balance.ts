import { Contract, RpcProvider } from "starknet";
import ERC20 from "../constant/abi/StarknetErc20.json";

export const getTokenBalance = async (
  tokenAddress: string,
  accountAddress: string,
  provider: RpcProvider
) => {
  const tokenContract = new Contract(ERC20, tokenAddress, provider);
  const balance = await tokenContract?.balanceOf(accountAddress);
  return Number(balance);
};
