const cron = require('node-cron');
const { fetchTransactionsForLastTenBlocks, fetchTransactionReceipts } = require('./transactionService');

// Scheduled task to fetch transactions and receipts every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
    await fetchTransactionsForLastTenBlocks();
    await fetchTransactionReceipts();
});
