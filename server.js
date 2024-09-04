const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors")


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
// Connect to MongoDB
mongoose.connect('mongodb+srv://aagamanvarma1:passpass@testdb.6oxpf.mongodb.net/money_tracker', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Transaction schema
const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String,
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    const transaction = new Transaction({
        description: req.body.description,
        amount: req.body.amount,
        type: req.body.type
    });

    try {
        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));