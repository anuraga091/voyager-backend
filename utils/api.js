const axios = require('axios');
const STARKNET_URL = 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7';
const ETH_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'


exports.fetchLatestBlockNumber = async () => {
    const url = STARKNET_URL;
    const data = {
        jsonrpc: "2.0",
        method: "starknet_blockNumber",
        params: [],
        id: 1
    };
    const response = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
    return parseInt(response.data.result);
};

exports.fetchTransactions = async (blockNumber) => {
    const url = STARKNET_URL;
    const data = {
        jsonrpc: "2.0",
        method: "starknet_getBlockWithTxs",
        params: [{ block_number: blockNumber }],
        id: 1
    };
    const response = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
    return response.data.result || [];
};


exports.fetchLatestETHPrice = async () => {
    const url = ETH_PRICE_URL;
    const response = await axios.get(url, { headers: { 'Content-Type': 'application/json' } });
    return response.data || [];
};

exports.fetchTransactionReceipt = async (hash) => {
    const url = STARKNET_URL;
    const data = {
        jsonrpc: "2.0",
        method: "starknet_getTransactionReceipt",
        params: [hash],
        id: 1
    };
    const response = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
    return response.data.result || [];
};
