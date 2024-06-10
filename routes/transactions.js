const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');

// Route to trigger fetching transactions manually
router.get('/transactions', async (req, res) => {
    console.log('query:', req.query)
    try {
        const transactions = await transactionService.getTransactions(req.query);
        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
