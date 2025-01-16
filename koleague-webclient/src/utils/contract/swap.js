import axios from "axios";
import { Account, CallData, Contract, RpcProvider, cairo, constants, num } from "starknet";
// import BigNumber from 'bignumber.js';

const TOKEN1_ADDRESS = '0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8'
const TOKEN0_ADDRESS = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d'
const contractAddress = '0x04505a9f06f2bd639b6601f37a4dc0908bb70e8e0e0c34b1220827d64f4fc066'

export const TOKEN_ADDRESS_CONSTANT = {
  "STRK": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  "USDC": "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
  "USDT": "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
  "ETH": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  "EKUBO": "0x075afe6402ad5a5c20dd25e10ec3b3986acaa647b77e4ae24b0cbc9a54a27a87",
}

export const DECIMAL = {
  "STRK": 10 ** 18,
  "USDC": 10 ** 6,
  "USDT": 10 ** 6,
  "ETH": 10 ** 18,
  "EKUBO": 10 ** 18,
}


export const provider = new RpcProvider({
  nodeUrl:
    'https://starknet-mainnet.core.chainstack.com/a7cc4871885aa29bb7669275e838ea92',
});

const getQuote = async (amount, token0, token1) => {
  try {
    const quote = await axios.get(`https://mainnet-api.ekubo.org/quote/${amount * 10 ** 18}/${token0}/${token1}`)
    console.log(JSON.stringify(quote.data));

    return quote.data
  } catch (error) {
    console.log(error);
    return null
  }
}

export const swapToken = async (amount, token0, token1, account) => {
  // const wallet = {
  //     accountAddress: '',
  //     privateKey: ''
  // }
  // const account = new Account(provider, wallet.accountAddress, wallet.privateKey, "1", constants.TRANSACTION_VERSION.V3,);
  try {
    const quote = await getQuote(amount, token0, token1)
    if (quote && quote.splits && quote.splits.length > 0) {
      const routeArr = quote.splits
      const swaps = []
      for (let i = 0; i < routeArr.length; i++) {
        const element = routeArr[i];
        const route = []
        for (let index = 0; index < element.route.length; index++) {
          const route_elm = element.route[index];
          const obj_elm = {
            pool_key: route_elm.pool_key,
            sqrt_ratio_limit: cairo.uint256(route_elm.sqrt_ratio_limit),
            skip_ahead: route_elm.skip_ahead
          }

          route.push(obj_elm)
        }
        const obj = {
          route: route,
          token_amount: {
            token: TOKEN_ADDRESS_CONSTANT[token0],
            amount: {
              mag: num.toBigInt(element.specifiedAmount),
              sign: false
            }
          }
        }
        swaps.push(obj)
      }

      console.log('swaps', swaps)

      const multiCall = await account.execute([
        {
          contractAddress: TOKEN_ADDRESS_CONSTANT[token0],
          entrypoint: 'transfer',
          calldata: CallData.compile({
            recipient: contractAddress,
            amount: cairo.uint256(amount * 10 ** 18)
          }),
        },
        {
          contractAddress: contractAddress,
          entrypoint: 'multi_multihop_swap',
          calldata: CallData.compile({ swaps }),
        },
        {
          contractAddress: contractAddress,
          entrypoint: 'clear_minimum',
          calldata: CallData.compile({
            token: {
              contract_address: TOKEN_ADDRESS_CONSTANT[token1]
            },
            minimum: cairo.uint256(quote.total)
          }),
        },
        {
          contractAddress: contractAddress,
          entrypoint: 'clear',
          calldata: CallData.compile({
            token: {
              contract_address: TOKEN_ADDRESS_CONSTANT[token0]
            }
          }),
        },
      ]);

      console.log(multiCall);
      const receipt = await account.waitForTransaction(multiCall.transaction_hash);
      return {
        status: true,
        data: receipt,
      }
    }
    return {
      status: false,
      error: "Pair not found!"
    }
  } catch (err) {
    console.log('err', err)
    return {
      status: false,
      error: err.message
    }
  }
}

export const transfer = async (amount, tokenAddress, recipient, account) => {
  // const wallet = {
  //     accountAddress: '',
  //     privateKey: ''
  // }
  // const account = new Account(provider, wallet.accountAddress, wallet.privateKey, "1", constants.TRANSACTION_VERSION.V3,);
  try {
    console.log('account', account)
    const multiCall = await account.execute([
      {
        contractAddress: tokenAddress,
        entrypoint: "transfer",
        calldata: CallData.compile({
          recipient: recipient,
          amount: cairo.uint256(amount * 10 ** 18),
        }),
      },
    ]);
    const receipt = await account.waitForTransaction(multiCall.transaction_hash);
    return {
      status: true,
      data: receipt
    }
  } catch (err) {
    // console.log('err', err.message)
    return {
      status: false,
      error: err.message
    }
  }
}

export const formatResponseTokenInOut = (token) => token === "None" ? null : token

// start(1, 'STRK', 'USDC')