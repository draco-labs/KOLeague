import axios from "axios";

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const numberWithCommas = (x = "") => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatAddress(string = '') {
  return string?.slice(0, 6) + "..." + string?.slice(-4)
}

export function splitStringByLength(inputString, length) {
  let result = [];
  for (let i = 0; i < inputString.length; i += length) {
    result.push(inputString.slice(i, i + length));
  }
  return result;
}

export function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export const converDateToUTC = (date = "") => {
  if (!date.endsWith("Z")) date = date + "Z"
  return new Date(date)
}

export const DIVIDE_APTOS = 100000000
export const DIVIDE_SUI = 1000000000
export const DIVIDE_SEI = 1000000

export const checkAddress = (address = "") => address?.length === 66

export const formatHexAddress = (address) => {
  if (!address)
    return address
  let addressHex = address.slice(2)
  let formatAddressHex = addressHex.replace(/^0+/, '');
  return `0x${formatAddressHex}`
}
export const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

export const roundOrKeep = (num) => {
  num = +num
  const negative = num < 0
  if (negative) num = -num
  if (num <= 0) return num
  const init = num
  let exponent = 0
  while (num < 0.1 || exponent > 10) {
    exponent += 1;
    num *= 10
  }
  num = Math.floor(num * 100) / 100

  if (negative) return -Math.floor(init * (10 ** (exponent + 2))) / (10 ** (exponent + 2))
  return Math.floor(init * (10 ** (exponent + 2))) / (10 ** (exponent + 2))
}

export const getMediaData = async (uri_raw) => {
  if (!uri_raw) return {}
  console.log('uri_raw', uri_raw)

  if (uri_raw?.includes('.png') || uri_raw?.includes('.jpeg') || uri_raw?.includes('.webp') || uri_raw?.includes('.gif')) {
    return {
      image: uri_raw
    }
  }

  const uri = uri_raw?.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
  console.log('uri', uri)
  try {

    const { data } = await axios.get(uri)

    if (data?.properties?.length > 0) {
      data.attributes = data?.properties.map(item => ({
        trait_type: item.key,
        value: item.value,
      }))
    }


    if (data?.image) {
      const attributesJSON = JSON.stringify(data?.attributes || [])
      return {
        ...data,
        image: data?.image?.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/"),
        attributes: JSON.parse(attributesJSON?.replace("\\u0000", ""))
      }
    }
    else
      return {
        image: uri_raw
      }
  } catch (err) {
    return {
      image: uri_raw
    }
  }
}

// Hàm lưu trữ giá trị vào localStorage
export const setValue = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// Hàm lấy giá trị từ localStorage
export const getValue = (key) => {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  return null;
}

// Hàm xóa giá trị từ localStorage
export const removeValue = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

export function formatDateToUTC(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    return null; 
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export function subDate(date, num = 0, isSub = true) {
  let d = new Date(date)
  d.setDate(d.getDate() - num);
  return d.toISOString().substring(0, 10)
}

export function formatNumber(num = 0) {
  if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';  // Billion
  } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';  // Million
  } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';  // Thousand
  } else {
      return num.toString();  // Less than 1,000, just return the number as is
  }
}

export function formatTokenEth(price) {
	return Math.round(price * 1000) / 1000
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


//KOLeague
export const convertTwitterLinkToHandle = (url) => {
  if (!url) return null; 

  const regex = /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/([a-zA-Z0-9_]+)/;
  const match = url.match(regex);
  return match ? `@${match[1]}` : null;
};
export const convertClickTwitterLink = (url) => {
  if (!url) return null; 

  const regex = /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/([a-zA-Z0-9_]+)/;
  const match = url.match(regex);
  return match ? `https://x.com/${match[1]}` : null;
};
export const convertTokenList = (tokenList) => {
  if (!tokenList) return [];
  return tokenList.split(";").map((token) => token.trim());
};

export const convertDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} UTC ${day}/${month}`;
  return formattedTime;
};

export const highlightContent = (content) => {
  if (!content) return "";
  const regex = /(#\w+|\$\w+)/g;
  return content.replace(regex, (match) => `<span style="color: #08efe8;">${match}</span>`);
};