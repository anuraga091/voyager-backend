require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transactions');

const app = express();
app.use(express.json());

connectDB();

app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
