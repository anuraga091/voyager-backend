const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    block_number: { type: Number, index: true, unique: true },
    status: String,
    block_hash: String,
    parent_hash: String,
    new_root: String,
    timestamp: Number,
    sequencer_address: String,
    l1_gas_price: Object,
    l1_data_gas_price: Object,
    l1_da_mode: String,
    starknet_version: String,
    fetchedAt: {
        type: Date,
        default: Date.now
    }
});

const Block = mongoose.model('Block', blockSchema);
module.exports = Block;
