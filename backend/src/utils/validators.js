import { TronWeb } from "tronweb";

const walletValidators = {
  ethereum: (address) => /^0x[a-fA-F0-9]{40}$/.test(address),
  bitcoin: (address) => {
    // Legacy (P2PKH): starts with 1
    // SegWit (P2SH): starts with 3
    // Bech32 (P2WPKH/P2WSH): starts with bc1
    return (
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) ||
      /^bc1[a-z0-9]{39,59}$/.test(address)
    );
  },
  tron20: (address) => {
    try {
      return TronWeb.isAddress(address);
    } catch (err) {
      return false;
    }
  },
  litecoin: (address) => {
    // Legacy: starts with L or M
    // SegWit: starts with ltc1
    return (
      /^[LM][a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(address) ||
      /^ltc1[a-z0-9]{39,59}$/.test(address)
    );
  },
  solana: (address) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address),
  polygon: (address) => /^0x[a-fA-F0-9]{40}$/.test(address), // Same as Ethereum
  avalanche: (address) => {
    // C-Chain uses Ethereum format, X/P chains use different format
    return (
      /^0x[a-fA-F0-9]{40}$/.test(address) ||
      /^[XP]-[a-zA-Z0-9]{39}$/.test(address)
    );
  },
  xrp: (address) =>
    /^r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{25,34}$/.test(
      address
    ),
  dogecoin: (address) =>
    /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/.test(address),
  cardano: (address) =>
    /^addr1[a-z0-9]{98}$/.test(address) ||
    /^[Aa][a-zA-Z0-9]{54,}$/.test(address),
  fantom: (address) => /^0x[a-fA-F0-9]{40}$/.test(address), // Same as Ethereum
  arbitrum: (address) => /^0x[a-fA-F0-9]{40}$/.test(address), // Same as Ethereum
  optimism: (address) => /^0x[a-fA-F0-9]{40}$/.test(address), // Same as Ethereum
  bitcoinCash: (address) => {
    // Legacy format or CashAddr format
    return (
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) ||
      /^((bitcoincash|bchreg|bchtest):)?[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{42}$/.test(
        address
      )
    );
  },
  stellar: (address) => /^G[A-Z2-7]{55}$/.test(address),
  tezos: (address) => /^tz[1-3][1-9A-HJ-NP-Za-km-z]{33}$/.test(address),
  neo: (address) => /^A[0-9a-zA-Z]{33}$/.test(address),
  algorand: (address) => /^[A-Z2-7]{58}$/.test(address),
  zcash: (address) => {
    // t-addresses (transparent) or z-addresses (shielded)
    return (
      /^t1[a-zA-Z0-9]{33}$/.test(address) ||
      /^zs1[a-z0-9]{75}$/.test(address) ||
      /^zc[a-zA-Z0-9]{93}$/.test(address)
    );
  },
  binance: (address) => /^(bnb1|0x)[a-fA-F0-9a-z]{38,42}$/.test(address),
};

export default walletValidators;
