import { Account, RpcProvider } from "starknet";
import {
  getTokenBalance,
  getTokenDataByTokenAddress,
  swap,
  transfer,
} from "../tools/index";
import { STARKNET_OFFSET } from "../constant";

export class StarknetAgent {
  private readonly privateKey: string;
  private readonly accountAddress: string;
  private readonly rpc: string;
  private readonly wallet: Account;
  private readonly provider: RpcProvider;
  constructor(
    privateKey: string,
    accountAddress: string,
    rpc = "https://starknet-mainnet.core.chainstack.com/83b2dbd5efa33f683f0fe598b459a30d"
  ) {
    this.privateKey = privateKey;
    this.rpc = rpc;
    this.accountAddress = accountAddress;
    this.provider = new RpcProvider({ nodeUrl: rpc });
    this.wallet = new Account(this.provider, accountAddress, privateKey);
  }

  async getTokenBalance(tokenAddress: string) {
    try {
      const res = await getTokenBalance(
        tokenAddress,
        this.accountAddress,
        this.provider
      );
      return res;
    } catch (error: any) {
      throw new Error(`Failed to fetch token balance: ${error.message}`);
    }
  }

  async transfer(tokenAddress: string, amount: number, recipient: string) {
    try {
      const balance = await this.getTokenBalance(tokenAddress);
      if (balance < amount * STARKNET_OFFSET)
        throw new Error("Not enough balance.");
      const res = await transfer(this.wallet, tokenAddress, amount, recipient);
      return res;
    } catch (error: any) {
      throw new Error(`Failed to transfer token: ${error.message}`);
    }
  }

  async swap(tokenIn: string, tokenOut: string, tokenInAmount: number) {
    try {
      const balance = await this.getTokenBalance(tokenIn);
      if (balance < tokenInAmount * STARKNET_OFFSET)
        throw new Error("Not enough balance.");
      const res = await swap(this.wallet, tokenIn, tokenOut, tokenInAmount);
      return res;
    } catch (error: any) {
      throw new Error(`Failed to transfer token: ${error.message}`);
    }
  }

  async deployToken() {}

  async getTokenData(tokenAddress: string) {
    try {
      const res = await getTokenDataByTokenAddress(tokenAddress);
      return res;
    } catch (error: any) {
      throw new Error(`Failed to fetch token data: ${error.message}`);
    }
  }

  async getCurrentBlockNumber() {
    try {
      const latestBlock = await this.provider.getBlock("latest");
      const blockNumber = latestBlock.block_number;
      return blockNumber;
    } catch (error: any) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
