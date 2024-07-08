## How to setup?
1. Clone this repo
2. Go inside the folder and do `npm install`
3. Once done with `npm install` then start the server with `npm run dev`

## Functionality
1. 3 Schema to save the response from 4 APIs
2. 2 APIs to connect with frontend and sending information
3. 1 API have filter, pagination logic

## How to call API from frontend?
BASE_URL = 'http://localhost:3001'; 

API URL to get all transactions = `${BASE_URL}/api/transactions`, {
      params: {
        page,
        limit,
        type
      }
    }

API URL to fetch each transaction data with it's transaction_hash = `${BASE_URL}/transaction/${hash}`

Ex: 
const BASE_URL = 'http://localhost:3001'; 

export const fetchTransactions = async (page, limit, type) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/transactions`, {
      params: {
        page,
        limit,
        type
      }
    });
    return response.data;  
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error; 
  }
};

export const fetchTransactionData = async (hash) => {
  try {
    const response = await axios.get(`${BASE_URL}/transaction/${hash}`);
    return response.data
  } catch (error){
    console.error('Error fetching transactions data:', error);
    throw error; 
  }
}

To setup you have to include Mongo DB credential in .env file:
MONGODB_USERNAME=XXXXXXXXXX
MONGODB_PASSWORD=XXXXXXXXXXX
MONGODB_URI="mongodb+srv://MONGODB_USERNAME:MONGODB_PASSWORD@cluster0.68vz8pu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

File Structures:
server.js is our global file where everything starts
In config/db.js, we connect the mongo db
Inside models, We have 3 schema's -> blockModel.js, transactionModel.js(getting from starknet_blockNumber, starknet_getBlockWithTxs), transactionReceiptModel.js(getting from starknet_getTransactionReceipt)

We have 2 routes inside routes folder
transaction.js
transactionReceipt.js

We have 2 services in services folder where we are defining logics
transactionService.js for all the logic related to transaction and receipt
cronjob.js for logic of saving the data in db every 30 secs

We have utils where we can write common usable functions
we have utils/api.js where we have wrote all the apis that we need to data from
