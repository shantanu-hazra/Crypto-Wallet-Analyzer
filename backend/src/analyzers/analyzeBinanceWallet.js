const knownMixers = new Set([
  // Add known BSC mixer contracts if any (example below is Ethereum's Tornado)
  "0xd4b88df4d29f5cedd6857912842cff3b20c8cfa3",
]);

const knownContracts = new Set([
  // Add trusted contract addresses (e.g., PancakeSwap, Venus, etc.)
]);

const analyzeBinanceWallet = (transactions) => {
  const suspiciousFlags = new Set();
  const timestampsBySender = {};

  transactions.forEach((tx) => {
    const from = tx.from?.toLowerCase();
    const to = tx.to?.toLowerCase() || "";
    const input = tx.input;
    const timeStamp = parseInt(tx.timeStamp);
    const value = parseFloat(tx.value) / 1e18;

    // Dusting Attack (< 0.001 BNB)
    if (value > 0 && value < 0.001) {
      suspiciousFlags.add("Dusting transaction (< 0.001 BNB)");
    }

    // Mixer or flagged address
    if (knownMixers.has(to)) {
      suspiciousFlags.add("Sends to mixer or flagged address");
    }

    // Unknown smart contract
    if (input && input !== "0x" && !knownContracts.has(to)) {
      suspiciousFlags.add("Unknown smart contract interaction");
    }

    // High-frequency detection
    if (!timestampsBySender[from]) timestampsBySender[from] = [];
    timestampsBySender[from].push(timeStamp);
  });

  // Detect burst transactions
  for (const [sender, timestamps] of Object.entries(timestampsBySender)) {
    if (timestamps.length < 5) continue;
    const sorted = timestamps.sort((a, b) => a - b);
    const timeRange = sorted[sorted.length - 1] - sorted[0];
    if (timeRange < 300) {
      suspiciousFlags.add("High-frequency activity (<5 min)");
    }
  }

  // Risk Level Evaluation
  const totalFlags = suspiciousFlags.size;
  let risk = "low";
  let reason = "No significant suspicious activity detected.";
  if (totalFlags >= 3) {
    risk = "high";
    reason = "Multiple suspicious behaviors detected.";
  } else if (totalFlags >= 2) {
    risk = "medium";
    reason = "Some suspicious activity observed.";
  }

  return {
    risk,
    reason,
    detailedReport: suspiciousFlags,
  };
};

export default analyzeBinanceWallet;
