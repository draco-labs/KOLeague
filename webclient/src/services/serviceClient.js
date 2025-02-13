import axios from "axios";

const serviceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const serviceClientAirdrop = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

serviceClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt")
    const customHeaders = {};
    if (token && token !== 'null' && token !== 'undefined') customHeaders["Authorization"] = "Bearer " + token;
    return {
      ...config,
      headers: {
        ...customHeaders, // auto attach token
        ...config.headers, // but you can override for some requests
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

serviceClientAirdrop.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt")
    const customHeaders = {};
    if (token && token !== 'undefined' && token !== 'undefined') customHeaders["Authorization"] = "Bearer " + token;
    return {
      ...config,
      headers: {
        ...customHeaders, // auto attach token
        ...config.headers, // but you can override for some requests
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default serviceClient;
export { serviceClientAirdrop }