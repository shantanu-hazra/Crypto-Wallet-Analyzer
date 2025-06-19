const knownMixers = new Set([
  "0xd4b88df4d29f5cedd6857912842cff3b20c8cfa3", // Example: Tornado Cash
]);

const knownContracts = new Set([
  // You can add Uniswap, Aave, etc., if needed
]);

const analyzeEthereum = (transactions) => {
  const suspiciousFlags = new Set();
  const timestampsBySender = {};

  transactions.forEach((tx) => {
    const from = tx.from.toLowerCase();
    const to = tx.to?.toLowerCase() || "";
    const input = tx.input;
    const timeStamp = parseInt(tx.timeStamp);
    const value = parseFloat(tx.value) / 1e18;

    // Dusting Attack
    if (value > 0 && value < 0.001) {
      suspiciousFlags.add("Dusting transaction (< 0.001 ETH)");
    }

    // Sends to known mixer
    if (knownMixers.has(to)) {
      suspiciousFlags.add("Sends to mixer or flagged address");
    }

    // Interacts with unknown contract
    if (input && input !== "0x" && !knownContracts.has(to)) {
      suspiciousFlags.add("Unknown smart contract interaction");
    }

    // Track timestamps for high-frequency detection
    if (!timestampsBySender[from]) timestampsBySender[from] = [];
    timestampsBySender[from].push(timeStamp);
  });

  // High-frequency transaction analysis
  for (const [sender, timestamps] of Object.entries(timestampsBySender)) {
    if (timestamps.length < 5) continue;
    const sorted = timestamps.sort((a, b) => a - b);
    const timeRange = sorted[sorted.length - 1] - sorted[0];
    if (timeRange < 300) {
      suspiciousFlags.add("High-frequency activity (<5 min)");
    }
  }

  // Convert Sets to Arrays for output
  const flagsByWallet = {};
  let totalFlags = suspiciousFlags.size;

  // Risk scoring
  let risk = "low";
  let reason = "No significant suspicious activity detected.";
  if (totalFlags >= 3) {
    risk = "high";
    reason =
      "Multiple suspicious behaviors detected (e.g., mixers, dusting, high-frequency).";
  } else if (totalFlags >= 2) {
    risk = "medium";
    reason =
      "Some suspicious activity observed (e.g., dusting or unknown contracts).";
  }

  return {
    risk, // 'low', 'medium', 'high'
    reason, // one-line summary
    detailedReport: suspiciousFlags, // full detail
  };
};

export default analyzeEthereum;
