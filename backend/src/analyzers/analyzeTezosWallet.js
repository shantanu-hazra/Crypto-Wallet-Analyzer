const analyzeTezosWallet = (operations) => {
  const suspiciousFlags = new Set();
  const timestampsBySender = {};

  operations.forEach((op) => {
    const type = op.type;
    const amount = op.amount || 0;
    const sender = op.sender?.address;
    const target = op.target?.address;
    const timestamp = new Date(op.timestamp).getTime() / 1000;

    // Dusting
    if (amount > 0 && amount < 1_000_000) {
      suspiciousFlags.add("Dusting transaction (< 1 ꜩ)");
    }

    // Unknown contract
    if (
      type === "transaction" &&
      op.parameter &&
      !op.entrypoint?.startsWith("default")
    ) {
      suspiciousFlags.add(
        "Smart contract interaction (non-default entrypoint)"
      );
    }

    // Track for high-frequency
    if (sender) {
      if (!timestampsBySender[sender]) timestampsBySender[sender] = [];
      timestampsBySender[sender].push(timestamp);
    }
  });

  for (const [sender, times] of Object.entries(timestampsBySender)) {
    if (times.length >= 5) {
      const sorted = times.sort();
      const timeRange = sorted[sorted.length - 1] - sorted[0];
      if (timeRange < 300) {
        suspiciousFlags.add("High-frequency activity (<5 min)");
      }
    }
  }

  // Final risk scoring
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

export default analyzeTezosWallet;
