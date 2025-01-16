import { Account, CallData, cairo } from "starknet";
import { getTokenBalance } from "./get-token-balance";
import { STARKNET_OFFSET } from "../constant";

export const transfer = async (
  wallet: Account,
  tokenAddress: string,
  amount: number,
  recipient: string
) => {
  const multiCall = await wallet.execute([
    {
      contractAddress: tokenAddress,
      entrypoint: "transfer",
      calldata: CallData.compile({
        recipient: recipient,
        amount: cairo.uint256(amount * STARKNET_OFFSET),
      }),
    },
  ]);
  const receipt = await wallet.waitForTransaction(multiCall.transaction_hash);
  return receipt;
};
