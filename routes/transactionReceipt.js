const express = require('express');
const TransactionReceipt = require('../models/transactionRecieptModel');
const Transaction = require('../models/transactionModel');
const router = express.Router();

router.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params;

    const transactionReceipt = await TransactionReceipt.findOne({ transaction_hash: hash });

    const transactionDetails = await Transaction.findOne({ transaction_hash: hash });

    const response = {
        
        hash: transactionReceipt.transaction_hash,
        type: transactionReceipt.type || '',
        timestamp: transactionReceipt.fetchedAt,
        status: transactionReceipt.execution_status || 'UNKNOWN',
        block_number: transactionReceipt.block_number,
        transaction_details: {
            block_number: transactionReceipt.block_number,
            timestamp: transactionReceipt.fetchedAt,
            actual_fee: transactionReceipt.actual_fee ? `${transactionReceipt.actual_fee.amount} ${transactionReceipt.actual_fee.unit}` : '',
            max_fee: transactionDetails ? transactionDetails.max_fee || '' : '',
            gas_consumed: transactionReceipt.execution_resources?.gas_consumed || '',
            sender_address: transactionDetails ? transactionDetails.sender_address || '' : ''
        },
        dev_info: {
            timestamp: transactionReceipt.fetchedAt,
            nonce: transactionDetails ? transactionDetails.nonce || '' : '',
            position: transactionDetails ? transactionDetails.position || '' : '',
            version: transactionReceipt.version || ''
        },
        execution_resources: transactionReceipt?.execution_resources ? transactionReceipt?.execution_resources : {},
        signature: transactionDetails ? transactionDetails.signature || [] : [],
        calldata: transactionDetails ? transactionDetails.calldata || [] : [],
        events: transactionReceipt ? transactionReceipt.events || [] : [],
    };

    res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
