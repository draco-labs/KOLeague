import {
  metamaskWallet,
  coinbaseWallet,
  trustWallet,
//   walletConnect,
} from "@thirdweb-dev/react";
export const evmWallets = [
  {
    name: "Metamask",
    src: "/images/evm/metamask.png",
    type: "base",
    config: metamaskWallet(),
    ext: "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
  },
  {
    name: "Coinbase",
    src: "/images/evm/coinbase.png",
    type: "base",
    config: coinbaseWallet(),
    ext: "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
  },
  {
    name: "Trust Wallet",
    src: "/images/evm/trustwallet.png",
    type: "base",
    config: trustWallet(),
    ext: "https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph",
  },
//   {
//     name: "Wallet Connect",
//     src: "/images/evm/walletconnect.png",
//     type: "base",
//     config: walletConnect(),
//     ext: "https://chrome.google.com/webstore/detail/compass-wallet-for-sei/anokgmphncpekkhclmingpimjmcooifb",
//   },
];
