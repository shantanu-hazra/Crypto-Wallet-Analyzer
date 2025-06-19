import analyzeEthereumWallet from "../analyzers/analyzeEthereumWallet.js";
import analyzeTronWallet from "../analyzers/analyzeTronWallet.js";
import analyzeBinanceWallet from "../analyzers/analyzeBinanceWallet.js";
import analyzeTezosWallet from "../analyzers/analyzeTezosWallet.js";
import analyzeSolanaWallet from "../analyzers/analyzeSolanaWallet.js";
import analyzeBitcoinWallet from "../analyzers/analyzeBitcoinWallet.js";

const analyzerMapper = {
  ethereum: analyzeEthereumWallet,
  tron20: analyzeTronWallet,
  binance: analyzeBinanceWallet,
  solana: analyzeSolanaWallet,
  tezos: analyzeTezosWallet,
  bitcoin: analyzeBitcoinWallet,
  default: () => ({
    risk: "low",
    reason: "No analyzer available for this chain.",
    detailedReport: new Set(),
  }),
};

export default analyzerMapper;
