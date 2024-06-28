const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    block_number: { type: Number, index: true },
    transaction_hash: { type: String, unique: true },
    type: String,
    version: String,
    nonce: String,
    sender_address: String,
    signature: [String],
    calldata: [String],
    resource_bounds: Object,
    tip: String,
    paymaster_data: [String],
    account_deployment_data: [String],
    nonce_data_availability_mode: String,
    fee_data_availability_mode: String,
    status: String,
    max_fee: String,
    fetchedAt: {
        type: Date,
        default: Date.now
    }
},{strict: false});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
