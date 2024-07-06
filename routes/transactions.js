const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');

router.get('/', async (req, res) => {
    try {
        const { page, limit, type } = req.query;
        const transactions = await transactionService.getTransactions({ page, limit, type });
        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
