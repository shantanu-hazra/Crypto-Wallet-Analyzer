const knownMixers = new Set([
  // Add known suspicious or mixer addresses (Base58 format)
]);

const knownContracts = new Set([
  // Add known verified contract addresses if needed
]);

const analyzeTronWallet = (transactions) => {
  const suspiciousFlags = new Set();
  const timestampsBySender = {};

  transactions.forEach((tx) => {
    const contract = tx.raw_data?.contract?.[0];
    const timestamp = tx.block_timestamp;
    const type = contract?.type;
    const valueRaw = contract?.parameter?.value?.amount || 0;
    const from = contract?.parameter?.value?.owner_address || "";
    const to = contract?.parameter?.value?.to_address || "";

    const value = valueRaw / 1e6; // TRON uses 6 decimal precision

    // Dusting attack (<1 TRX)
    if (value > 0 && value < 1) {
      suspiciousFlags.add("Dusting transaction (< 1 TRX)");
    }

    // Sends to known mixer
    if (knownMixers.has(to)) {
      suspiciousFlags.add("Sends to mixer or flagged address");
    }

    // Interacts with a smart contract (anything except TransferContract)
    if (type && type !== "TransferContract" && !knownContracts.has(to)) {
      suspiciousFlags.add("Unknown smart contract interaction");
    }

    // Track timestamps per sender for frequency analysis
    if (!timestampsBySender[from]) timestampsBySender[from] = [];
    timestampsBySender[from].push(timestamp);
  });

  // High-frequency detection
  for (const [sender, timestamps] of Object.entries(timestampsBySender)) {
    if (timestamps.length < 5) continue;
    const sorted = timestamps.sort((a, b) => a - b);
    const timeRange = sorted[sorted.length - 1] - sorted[0];
    if (timeRange < 300_000) {
      suspiciousFlags.add("High-frequency activity (<5 min)");
    }
  }

  // Risk scoring
  const totalFlags = suspiciousFlags.size;
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
    reason,
    detailedReport: suspiciousFlags,
  };
};

export default analyzeTronWallet;
