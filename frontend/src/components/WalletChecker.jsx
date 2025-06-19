import React, { useState, useEffect } from "react";
import axios from "axios";
import validationPatterns from "../utils/validators.js";
import "../App.css";

export default function WalletChecker() {
  const [wallet, setWallet] = useState("");
  const [walletType, setWalletType] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [risks, setRisks] = useState("");

  const wallets = [
    "Ethereum (ETH)",
    "Tron (TRC20)",
    "Binance (BEP20)",
    "Bitcoin (BTC)",
    "Litecoin (LTC)",
    "Solana (SOL)",
    "Polygon (MATIC)",
    "Avalanche (AVAX C-Chain)",
    "XRP (Ripple)",
    "Dogecoin (DOGE)",
    "Cardano (ADA)",
    "Fantom (FTM)",
    "Arbitrum & Optimism (Layer 2 for ETH)",
    "Bitcoin Cash (BCH)",
    "Stellar (XLM)",
    "Tezos (XTZ)",
    "NEO",
    "Algorand (ALGO)",
    "Zcash (ZEC)",
  ];

  const exampleAddresses = {
    "Ethereum (ETH)": "0x742d35Cc6634C0532925a3b8D400f60e4c5C6fA8",
    "Binance (BEP20)": "bnb1grpf0955h0ykzuafz0hs4r5h8lku5xjhxfr3hp",
    "Bitcoin (BTC)": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    "Litecoin (LTC)": "LdP8Qox1VAhCzLJNqRdFGb5w12RhbqLrYm",
    "Solana (SOL)": "DYw8jCTfwHNRJhNrUrqH1qJqRwkHpBYTznNVBWUfAEtB",
    "Polygon (MATIC)": "0x742d35Cc6634C0532925a3b8D400f60e4c5C6fA8",
    "Avalanche (AVAX C-Chain)": "0x742d35Cc6634C0532925a3b8D400f60e4c5C6fA8",
    "XRP (Ripple)": "rXRhqbowVEVXvPeUkqt5XGXo8DdnqxQu7V",
    "Dogecoin (DOGE)": "D6uLM8xSUjmNd1r1NL4PQRK8NL4PQRK8NL",
    "Cardano (ADA)":
      "addr1q8l0u0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0w0",
    "Fantom (FTM)": "0x742d35Cc6634C0532925a3b8D400f60e4c5C6fA8",
    "Arbitrum & Optimism (Layer 2 for ETH)":
      "0x742d35Cc6634C0532925a3b8D400f60e4c5C6fA8",
    "Bitcoin Cash (BCH)": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    "Stellar (XLM)": "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
    "Tezos (XTZ)": "tz1QnVNVhLYnFCZCp6dkVo7UJYyHm8SuGxPf",
    NEO: "ANrL4vPnQCCi5Mro4fqKK1rxrkxEHqMP2E",
    "Algorand (ALGO)":
      "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37A",
    "Zcash (ZEC)": "t1QnVNVhLYnFCZCp6dkVo7UJYyHm8SuGxPf",
  };

  const validateWallet = (address, type) => {
    if (!address || !type) return "";
    const pattern = validationPatterns[type];
    if (!pattern)
      return "Validation pattern not available for this wallet type";
    if (!pattern.test(address)) {
      return `Invalid ${type} address format`;
    }
    return "";
  };

  useEffect(() => {
    if (wallet && walletType) {
      setValidationError(validateWallet(wallet, walletType));
    } else {
      setValidationError("");
    }
  }, [wallet, walletType]);

  const checkWallet = async () => {
    if (!wallet.trim())
      return setResult({
        status: "error",
        message: "Please enter a wallet address",
      });
    if (!walletType)
      return setResult({
        status: "error",
        message: "Please select a wallet type",
      });

    const validationErr = validateWallet(wallet, walletType);
    if (validationErr)
      return setResult({ status: "invalid", message: validationErr });

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:3001/api/check-wallet", {
        wallet: wallet.trim(),
        walletType,
      });
      setResult(res.data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 429) {
        setResult({
          status: "error",
          message: "Rate limit exceeded. Please try again later.",
        });
      } else if (status === 404) {
        setResult({
          status: "clean",
          message: "Wallet not found or has no activity.",
        });
      } else {
        setResult({
          status: "error",
          message: "Failed to check wallet. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result) {
      setRiskLevel(result.riskLevel);
      setRisks(result.detailedReport);
    }
  }, [result]);

  const handleWalletTypeChange = (event) => {
    setWalletType(event.target.value);
    setWallet("");
    setResult(null);
    setValidationError("");
  };

  const handleWalletChange = (e) => {
    setWallet(e.target.value);
    setResult(null);
  };

  const useExampleAddress = () => {
    if (walletType && exampleAddresses[walletType]) {
      setWallet(exampleAddresses[walletType]);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Multi-Chain Wallet Security Checker</h1>

      <div className="mb-4">
        <label htmlFor="walletType" className="label">
          Select Wallet Type:
        </label>
        <select
          id="walletType"
          value={walletType}
          onChange={handleWalletTypeChange}
          className="select"
        >
          <option value="">Choose a wallet type...</option>
          {wallets.map((element, index) => (
            <option key={index} value={element}>
              {element}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="walletAddress" className="label">
          Wallet Address:
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="walletAddress"
            value={wallet}
            onChange={handleWalletChange}
            className={`input ${validationError ? "input-error" : ""}`}
            placeholder={
              walletType
                ? `Enter ${walletType} address`
                : "Select wallet type first"
            }
            disabled={!walletType}
          />
          {walletType && exampleAddresses[walletType] && (
            <button onClick={useExampleAddress} className="example-btn">
              Use Example
            </button>
          )}
        </div>
        {validationError && <p className="error-text">{validationError}</p>}

        <button
          onClick={checkWallet}
          disabled={loading || !wallet || !walletType || validationError}
          className={`button ${
            loading || !wallet || !walletType || validationError
              ? "button-disabled"
              : "button-active"
          }`}
        >
          {loading ? "Checking..." : "Check Wallet"}
        </button>
      </div>

      {risks && (
        <div>
          <p>Risk Level of the Wallet is: {riskLevel}</p>
          <label htmlFor="list">Risks analyzed:</label>
          <ul id="list">
            {risks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
          {risks === "high" ? (
            <p>The wallet is highly suspicious</p>
          ) : risks === "medium" ? (
            <p>The wallet is moderately suspicious</p>
          ) : (
            <p>The wallet is not suspicious</p>
          )}
        </div>
      )}
    </div>
  );
}
