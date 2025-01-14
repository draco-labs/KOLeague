import axios from "axios";
import { EKUBO_API_URL } from "../constant";

export const getQuote = async (
  tokenIn: string,
  tokenOut: string,
  amountIn: number
) => {
  try {
    const quote = await axios.get(
      `${EKUBO_API_URL}quote/${amountIn * 10 ** 18}/${tokenIn}/${tokenOut}`
    );
    // console.log(JSON.stringify(quote.data));

    return quote.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
