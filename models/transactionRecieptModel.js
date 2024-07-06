const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from_address: String,
    to_address: String,
    payload: [String]
}, { _id: false });

const eventSchema = new mongoose.Schema({
    from_address: String,
    keys: [String],
    data: [String]
}, { _id: false });

const transactionReceiptSchema = new mongoose.Schema({
    type: String,
    transaction_hash: { type: String, unique: true, index: true  },
    actual_fee: {
        amount: String,
        unit: String
    },
    ethereum: {
        type: Map,
        of: Number
    },
    execution_status: String,
    finality_status: String,
    block_hash: String,
    block_number: { type: Number, index: true },
    messages_sent: { type: [messageSchema], default: [] },
    events: { type: [eventSchema], default: [] },
    execution_resources: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    fetchedAt: {
        type: Date,
        default: Date.now
    },
}, { strict: false });

const TransactionReceipt = mongoose.model('TransactionReceipt', transactionReceiptSchema);
module.exports = TransactionReceipt;
