const axios = require('axios');
const STARKNET_URL = 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7';


exports.fetchLatestBlockNumber = async () => {
    const url = STARKNET_URL;
    const data = {
        jsonrpc: "2.0",
        method: "starknet_blockNumber",
        params: [],
        id: 1
    };
    const response = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
    // console.log('response of latest block', response.data)
    return parseInt(response.data.result);
};

exports.fetchTransactions = async (blockNumber) => {
    // console.log(blockNumber, 'block number fetched')
    const url = STARKNET_URL;
    const data = {
        jsonrpc: "2.0",
        method: "starknet_getBlockWithTxs",
        params: [{ block_number: blockNumber }],
        id: 1
    };
    // console.log('fetching all transaction')
    const response = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
    // console.log('response of transaction',response.data)
    return response.data.result || [];
};
