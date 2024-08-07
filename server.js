require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transactions');
const transactionReceiptRoutes = require('./routes/transactionReceipt')
const cronJob = require('./services/cronjob'); 

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/transactions', transactionRoutes);
app.use('/transaction', transactionReceiptRoutes)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
