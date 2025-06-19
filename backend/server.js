// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const crypto = require("crypto");
const analyzeWalletBehavior = require("./src/utils/analyzerMappers.js").default;
const walletValidators = require("./src/utils/validators.js").default;
const apiEndpoints = require("./src/utils/apiEndpoints.js").default;
const walletTypeMapping = require("./src/utils/walletMapper.js").default;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Wallet type mapping

// Known blacklists for different chains
const knownBlacklists = {
  ethereum: [
    "0x000000000000000000000000000000000000dEaD",
    "0x0000000000000000000000000000000000000000",
  ],
  bitcoin: ["1BitcoinEaterAddressDontSendf59kuE"],
  // Add more blacklisted addresses for other chains as needed
};

app.post("/api/check-wallet", async (req, res) => {
  const { wallet, walletType } = req.body;

  if (!wallet || !walletType) {
    return res.json({
      status: "error",
      message: "Wallet address and wallet type are required.",
    });
  }

  // Map wallet type to internal format
  const chainType = walletTypeMapping[walletType];
  if (!chainType) {
    return res.json({
      status: "error",
      message: "Unsupported wallet type.",
    });
  }

  // Validate wallet address format
  const validator = walletValidators[chainType];
  if (!validator || !validator(wallet)) {
    return res.json({
      status: "invalid",
      message: `Invalid ${walletType} address format.`,
    });
  }

  // Check against known blacklists
  const blacklist = knownBlacklists[chainType] || [];
  if (blacklist.includes(wallet)) {
    return res.json({
      status: "flagged",
      message: "Wallet is blacklisted.",
    });
  }

  try {
    // Get API configuration for this chain
    const apiConfig = apiEndpoints[chainType];

    if (!apiConfig) {
      return res.json({
        status: "clean",
        message: `${walletType} validation passed. API checking not available for this chain.`,
      });
    }

    let response;

    // Handle different API request types
    if (apiConfig.method === "POST") {
      response = await axios.post(
        apiConfig.url(wallet),
        apiConfig.body(wallet),
        {
          headers: apiConfig.headers || { "Content-Type": "application/json" },
        }
      );
    } else {
      const headers = apiConfig.headers || {};
      response = await axios.get(apiConfig.url(wallet), { headers });
    }

    const txs = apiConfig.parser(response.data);

    if (!txs) {
      return res.json({
        status: "error",
        message: "Failed to fetch transaction data.",
      });
    }

    console.log(response.data);
    // Analyze risk based on chain type
    const riskAnalyzer = analyzeWalletBehavior[chainType];
    const riskAnalysis = riskAnalyzer(txs);

    const statusMap = {
      low: "clean",
      medium: "suspicious",
      high: "flagged",
    };

    return res.json({
      status: statusMap[riskAnalysis.risk],
      message: riskAnalysis.reason,
      transactionCount: Array.isArray(txs) ? txs.length : 0,
      walletType: walletType,
      riskLevel: riskAnalysis.risk,
      detailedReport: Array.from(riskAnalysis.detailedReport),
    });
  } catch (error) {
    console.error(`Error checking ${walletType} wallet:`, error.message);

    // Handle specific API errors
    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        return res.status(429).json({
          status: "error",
          message: "API rate limit exceeded. Please try again later.",
        });
      } else if (status === 404) {
        return res.json({
          status: "clean",
          message: "Wallet address not found or has no activity.",
        });
      }
    }

    res.status(500).json({
      status: "error",
      message: `Error checking ${walletType} wallet.`,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Get supported wallet types
app.get("/api/wallet-types", (req, res) => {
  res.json({
    walletTypes: Object.keys(walletTypeMapping),
    supportedChains: Object.keys(walletValidators),
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `Supported wallet types: ${Object.keys(walletTypeMapping).length}`
  );
});
