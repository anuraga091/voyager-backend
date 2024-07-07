const Transaction = require('../models/transactionModel');
const Block = require('../models/blockModel');
const TransactionReceipt = require('../models/transactionRecieptModel');
const api = require('../utils/api');

let latestETHPrice; 

const fetchTransactionsForLastTenBlocks = async () => {
    try {
        const latestBlock = await api.fetchLatestBlockNumber();
        latestETHPrice = await api.fetchLatestETHPrice();
        const fetchPromises = [];

        for (let i = 0; i < 10; i++) {
            const blockNumber = latestBlock - i;
            fetchPromises.push(api.fetchTransactions(blockNumber));
        }

        const blockDataArrays = await Promise.all(fetchPromises);

        const saveBlockPromises = blockDataArrays.map(async (blockData) => {
            const { block_number, status, transactions, ...blockInfo } = blockData;
            const existingBlock = await Block.findOne({ block_number });

            if (!existingBlock) {
                const block = new Block({
                    block_number,
                    status,
                    ethereum: latestETHPrice.ethereum,
                    ...blockInfo
                });

                const transactionDocuments = transactions.map((transaction, index) => ({
                    block_number,
                    status,
                    position: index,
                    ethereum: latestETHPrice.ethereum,
                    ...transaction
                }));

                await block.save();
                await Transaction.insertMany(transactionDocuments);
            } else {
                console.log(`Block with number ${block_number} already exists.`);
            }
        });

        await Promise.all(saveBlockPromises);
    } catch (error) {
        console.error('Error fetching or saving transactions:', error);
    }
};

const getTransactions = async (params) => {
    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 20;
    const type = params.type || 'All';

    const query = {};
    if (type !== 'All') {
        query['type'] = type.toUpperCase();
    }

    const transactions = await Transaction.find(query)
        .sort({ fetchedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Transaction.countDocuments(query);

    return {
        transactions,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
};

const fetchTransactionReceipts = async () => {
    try {
        const transactions = await Transaction.find({}, 'transaction_hash');

        const fetchReceiptPromises = transactions.map(async (transaction) => {
            if (transaction && transaction.transaction_hash) {
                const existingReceipt = await TransactionReceipt.findOne({ transaction_hash: transaction.transaction_hash });

                if (!existingReceipt) {
                    
                    const transactionReceiptData = await api.fetchTransactionReceipt(transaction.transaction_hash);
                    if (transactionReceiptData) {
                        const dataToSave = {
                            ...transactionReceiptData,
                            ethereum: latestETHPrice.ethereum
                        };

                        const receipt = new TransactionReceipt(dataToSave);
                        await receipt.save();

                    }
                }
            }
        });

        await Promise.all(fetchReceiptPromises);
    } catch (error) {
        console.error('Error fetching or saving transaction receipts:', error);
    }
};

module.exports = { fetchTransactionsForLastTenBlocks, getTransactions, fetchTransactionReceipts };
