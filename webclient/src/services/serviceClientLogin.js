import axios from "axios";

const serviceClientLogin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

serviceClientLogin.interceptors.request.use(
  (config) => {
    const customHeaders = {};
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

export default serviceClientLogin;
