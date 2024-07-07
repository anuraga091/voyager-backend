const express = require('express');
const TransactionReceipt = require('../models/transactionRecieptModel');
const Transaction = require('../models/transactionModel');
const Block = require('../models/blockModel');
const router = express.Router();
const { fetchLatestETHPrice, fetchTransactionReceipt } = require('../utils/api');


router.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params;

    let [transactionReceipt, transactionDetails] = await Promise.all([
      TransactionReceipt.findOne({ transaction_hash: hash }).lean().exec(),
      Transaction.findOne({ transaction_hash: hash }).lean().exec()
    ]);

    
    if (!transactionReceipt) {
      const [ethPrice, transactionReceiptData] = await Promise.all([
        fetchLatestETHPrice(),
        fetchTransactionReceipt(hash)
      ]);

      if (!transactionReceiptData) {
        return res.status(404).send('Transaction receipt not found in external API');
      }

      const dataToSave = {
        ...transactionReceiptData,
        ethereum: ethPrice.ethereum
      };

      transactionReceipt = new TransactionReceipt(dataToSave);
      await transactionReceipt.save();

      transactionReceipt = transactionReceipt.toObject();
    }

    const blockDetails = await Block.findOne({ block_number: transactionReceipt.block_number }).lean().exec();
  
    const response = {
      id: transactionReceipt._id.toString(),
      hash: transactionReceipt.transaction_hash,
      type: transactionReceipt.type || '',
      timestamp: blockDetails.timestamp,
      status: transactionReceipt.execution_status || '',
      block_number: transactionReceipt.block_number,
      ethereum: blockDetails.ethereum,
      transaction_details: {
        block_number: transactionReceipt.block_number,
        timestamp: blockDetails.timestamp,
        actual_fee: transactionReceipt.actual_fee ? `${transactionReceipt.actual_fee.amount}` : '',
        max_fee: transactionDetails ? transactionDetails.max_fee || '' : '',
        l1_gas_price: blockDetails.l1_gas_price.price_in_wei,
        sender_address: transactionDetails ? transactionDetails.sender_address || '' : ''
      },
      dev_info: {
        timestamp: blockDetails.timestamp,
        nonce: transactionDetails ? transactionDetails.nonce || '' : '',
        position: transactionDetails ? transactionDetails.position || '' : '',
        version: transactionDetails? transactionDetails.version || '' : '',
      },
      execution_resources: transactionReceipt.execution_resources || {},
      signature: transactionDetails ? transactionDetails.signature || [] : [],
      calldata: transactionDetails ? transactionDetails.calldata || [] : [],
      events: transactionReceipt.events || [],
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
