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
            const { block_number, transactions, ...blockInfo } = blockData;
            const existingBlock = await Block.findOne({ block_number: block_number });

            if (!existingBlock) {
                const block = new Block({
                    block_number,
                    ...blockInfo
                });
                await block.save();

                const transactionDocuments = transactions.map(transaction => ({
                    block_number: block_number,
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
    const page = parseInt(params.page) || 1; // Ensure a default value if none provided
    const limit = parseInt(params.limit) || 20; // Default to 20 if no limit provided

    // Query to fetch transactions, sorted by 'data.fetchedAt' in descending order
    const transactions = await Transaction.find()
        .sort({ fetchedAt: -1 })  
        .skip((page - 1) * limit)
        .limit(limit);
    console.log(transactions) 

    // const options = {
    //     page,
    //     limit,
    //     sort: { 'data.fetchedAt': -1 } // Sorting by fetchedAt field
    // };

    // // If filtering capabilities are needed, add here similar to previous example
    // const filter = {};

    // // Check if any specific filters are needed based on additional query parameters
    // // For example, filtering by transaction type
    // if (params.type) {
    //     filter['data.type'] = params.type;
    // }

    // // Using Mongoose paginate method (make sure to set up the mongoose-paginate-v2 plugin)
    // const result = await Transaction.paginate(filter, options);
    // return result;
};

exports.fetchTransactionsForLastTenBlocks = fetchTransactionsForLastTenBlocks;
exports.getTransactions = getTransactions;
