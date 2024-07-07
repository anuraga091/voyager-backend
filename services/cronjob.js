const cron = require('node-cron');
const { fetchTransactionsForLastTenBlocks, fetchTransactionReceipts } = require('./transactionService');

cron.schedule('*/30 * * * * *', async () => {
    await fetchTransactionsForLastTenBlocks();
    await fetchTransactionReceipts();
});
