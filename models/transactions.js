const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    data: mongoose.Schema.Types.Mixed,
    fetchedAt: {
        type: Date,
        default: Date.now
    }
},{ strict: false });

module.exports = mongoose.model('Transaction', transactionSchema);
