const cron = require('node-cron');
//const Transaction = require('../models/transactions');
const Block = require('../models/block'); // Path to the Block model
const Transaction = require('../models/transaction');
const api = require('../utils/api');

const fetchTransactionsForLastTenBlocks = async () => {
    try {
        const latestBlock = await api.fetchLatestBlockNumber();
        const fetchPromises = [];
        for (let i = 0; i < 10; i++) {
            const blockNumber = latestBlock - i;
            fetchPromises.push(api.fetchTransactions(blockNumber));
        }
        const blockDataArrays = await Promise.all(fetchPromises);
        
        for (const blockData of blockDataArrays) {
            const { block_number, status, transactions, ...blockInfo } = blockData;
            const existingBlock = await Block.findOne({ block_number: block_number });

            if (!existingBlock) {
                const block = new Block({
                    block_number,
                    status,
                    ...blockInfo
                });
                await block.save();

                const transactionDocuments = transactions.map(transaction => ({
                    block_number: block_number,
                    status: status,
                    ...transaction
                }));
                await Transaction.insertMany(transactionDocuments);
            } else {
                console.log(`Block with number ${block_number} already exists.`);
            }
            
        }
    } catch (error) {
        console.error('Error fetching or saving transactions:', error);
    }
};




//Scheduled task to fetch transactions every 30 seconds
// cron.schedule('*/30 * * * * *', async () => {
//     await fetchTransactionsForLastTenBlocks();
// });



const getTransactions = async (params) => {
    console.log(params.page, params.limit)
    const page = parseInt(params.page) || 1; 
    const limit = parseInt(params.limit) || 20; 

    const transactions = await Transaction.find()
        .sort({ fetchedAt: -1 })  
        .skip((page - 1) * limit)
        .limit(limit);
    return transactions;

};

exports.fetchTransactionsForLastTenBlocks = fetchTransactionsForLastTenBlocks;
exports.getTransactions = getTransactions;
