// import { TronWeb } from "tronweb";

const validationPatterns = {
  "Ethereum (ETH)": /^0x[a-fA-F0-9]{40}$/,
  "Binance (BEP20)": /^(bnb1|0x)[a-fA-F0-9a-z]{38,42}$/,
  "Tron (TRC20)": /^T[a-zA-Z0-9]{33}$/,
  "Solana (SOL)": /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  "Tezos (XTZ)": /^tz[1-3][1-9A-HJ-NP-Za-km-z]{33}$/,
  "Bitcoin (BTC)": /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})$/,
  "Litecoin (LTC)": /^([LM][a-km-zA-HJ-NP-Z1-9]{26,33}|ltc1[a-z0-9]{39,59})$/,
  "Polygon (MATIC)": /^0x[a-fA-F0-9]{40}$/,
  "Avalanche (AVAX C-Chain)": /^(0x[a-fA-F0-9]{40}|[XP]-[a-zA-Z0-9]{39})$/,
  "XRP (Ripple)":
    /^r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{25,34}$/,
  "Dogecoin (DOGE)": /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/,
  "Cardano (ADA)": /^(addr1[a-z0-9]{98}|[Aa][a-zA-Z0-9]{54,})$/,
  "Fantom (FTM)": /^0x[a-fA-F0-9]{40}$/,
  "Arbitrum & Optimism (Layer 2 for ETH)": /^0x[a-fA-F0-9]{40}$/,
  "Bitcoin Cash (BCH)":
    /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|((bitcoincash|bchreg|bchtest):)?[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{42})$/,
  "Stellar (XLM)": /^G[A-Z2-7]{55}$/,
  NEO: /^A[0-9a-zA-Z]{33}$/,
  "Algorand (ALGO)": /^[A-Z2-7]{58}$/,
  "Zcash (ZEC)": /^(t1[a-zA-Z0-9]{33}|zs1[a-z0-9]{75}|zc[a-zA-Z0-9]{93})$/,
};

export default validationPatterns;
