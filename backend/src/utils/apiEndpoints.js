// API endpoints for different blockchains
const apiEndpoints = {
  ethereum: {
    url: (address) =>
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`,
    parser: (data) => data.result,
  },
  tron20: {
    url: (address) =>
      `https://api.trongrid.io/v1/accounts/${address}/transactions?only_confirmed=true&limit=200`,
    parser: (data) => data.data,
  },
  binance: {
    url: (address) =>
      `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${process.env.BSCSCAN_API_KEY}`,
    parser: (data) => data.result,
  },
  solana: {
    url: (address) => `https://api.mainnet-beta.solana.com`,
    method: "POST",
    body: (address) => ({
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [address, { limit: 10 }],
    }),
    parser: (data) => data.result,
  },
  tezos: {
    url: (address) => `https://api.tzkt.io/v1/accounts/${address}/operations`,
    parser: (data) => data,
  },
  bitcoin: {
    url: (address) => `https://blockstream.info/api/address/${address}/txs`,
    parser: (data) => data,
  },
  litecoin: {
    url: (address) =>
      `https://api.blockcypher.com/v1/ltc/main/addrs/${address}/txs`,
    parser: (data) => data,
  },
  polygon: {
    url: (address) =>
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${process.env.POLYGONSCAN_API_KEY}`,
    parser: (data) => data.result,
  },
  avalanche: {
    url: (address) =>
      `https://api.snowtrace.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${process.env.SNOWTRACE_API_KEY}`,
    parser: (data) => data.result,
  },
  xrp: {
    url: (address) =>
      `https://data.ripple.com/v2/accounts/${address}/transactions`,
    parser: (data) => data.transactions,
  },
  dogecoin: {
    url: (address) =>
      `https://dogechain.info/api/v1/address/transactions/${address}`,
    parser: (data) => data.transactions,
  },
  cardano: {
    url: (address) =>
      `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}/transactions`,
    headers: { project_id: process.env.BLOCKFROST_API_KEY },
    parser: (data) => data,
  },
  fantom: {
    url: (address) =>
      `https://api.ftmscan.com/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${process.env.FTMSCAN_API_KEY}`,
    parser: (data) => data.result,
  },
  stellar: {
    url: (address) =>
      `https://horizon.stellar.org/accounts/${address}/transactions`,
    parser: (data) => data._embedded.records,
  },
};

export default apiEndpoints;
