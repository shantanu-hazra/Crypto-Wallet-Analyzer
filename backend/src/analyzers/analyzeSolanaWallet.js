const analyzeSolanaWallet = (transactions) => {
  const suspiciousFlags = new Set();
  const timestampsBySigner = {};

  transactions.forEach((tx) => {
    const { transaction, blockTime } = tx;
    const signer = transaction.message.accountKeys?.[0];
    const instructions = transaction.message.instructions;
    const value = tx.meta?.postBalances?.[0] || 0;

    // Dusting: small SOL transfer
    if (value > 0 && value < 0.001 * 1e9) {
      suspiciousFlags.add("Dusting transaction (< 0.001 SOL)");
    }

    // Unknown contract interaction
    instructions.forEach((instr) => {
      const programId = transaction.message.accountKeys[instr.programIdIndex];
      if (!programId || !programId.startsWith("1111111")) {
        suspiciousFlags.add("Smart contract interaction with unknown program");
      }
    });

    // Track timestamp for frequency
    if (signer) {
      if (!timestampsBySigner[signer]) timestampsBySigner[signer] = [];
      timestampsBySigner[signer].push(blockTime);
    }
  });

  for (const [signer, times] of Object.entries(timestampsBySigner)) {
    if (times.length >= 5) {
      const sorted = times.sort();
      const timeRange = sorted[sorted.length - 1] - sorted[0];
      if (timeRange < 300) {
        suspiciousFlags.add("High-frequency activity (<5 min)");
      }
    }
  }

  // Final risk level
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

export default analyzeSolanaWallet;
