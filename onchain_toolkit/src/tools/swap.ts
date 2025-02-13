import { Account, CallData, cairo, num } from "starknet";
import { getQuote } from "../utils";
import { EKUBO_ROUTER_V3, STARKNET_OFFSET } from "../constant";

export const swap = async (
  wallet: Account,
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: number
) => {
  const multiCallData = await getSwapData(tokenIn, tokenOut, tokenInAmount);
  const multiCall = await wallet.execute(multiCallData);
  const receipt = await wallet.waitForTransaction(multiCall.transaction_hash);
  return receipt;
};

export const getSwapData = async (
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: number
) => {
  const quote = await getQuote(tokenIn, tokenOut, tokenInAmount);
  if (quote && quote.splits && quote.splits.length > 0) {
    const routeArr = quote.splits;
    const swaps = [];
    for (let i = 0; i < routeArr.length; i++) {
      const element = routeArr[i];
      const route = [];
      for (let index = 0; index < element.route.length; index++) {
        const route_elm = element.route[index];
        const obj_elm = {
          pool_key: route_elm.pool_key,
          sqrt_ratio_limit: cairo.uint256(route_elm.sqrt_ratio_limit),
          skip_ahead: route_elm.skip_ahead,
        };

        route.push(obj_elm);
      }
      const obj = {
        route: route,
        token_amount: {
          token: tokenIn,
          amount: {
            mag: num.toBigInt(element.specifiedAmount),
            sign: false,
          },
        },
      };
      swaps.push(obj);
    }

    const multiCallData = [
      {
        contractAddress: tokenIn,
        entrypoint: "transfer",
        calldata: CallData.compile({
          recipient: EKUBO_ROUTER_V3,
          amount: cairo.uint256(tokenInAmount * STARKNET_OFFSET),
        }),
      },
      {
        contractAddress: EKUBO_ROUTER_V3,
        entrypoint: "multi_multihop_swap",
        calldata: CallData.compile({ swaps }),
      },
      {
        contractAddress: EKUBO_ROUTER_V3,
        entrypoint: "clear_minimum",
        calldata: CallData.compile({
          token: {
            contract_address: tokenOut,
          },
          minimum: cairo.uint256(quote.total),
        }),
      },
      {
        contractAddress: EKUBO_ROUTER_V3,
        entrypoint: "clear",
        calldata: CallData.compile({
          token: {
            contract_address: tokenIn,
          },
        }),
      },
    ];
    return multiCallData;
  }
  return [];
};
