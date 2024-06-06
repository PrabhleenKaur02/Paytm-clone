const express = require("express");
const authMiddleware = require('../middleware');
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// ACCOUNT BALANCE
router.get('/balance', authMiddleware, async(req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    });
});


// TRANSFER MONEY
router.post('/transfer', authMiddleware, async(req, res) =>{
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // fetching the accounts within the transaction
    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    if(!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Insufficient balance/ Account not found"
        });
    };

    const toAccount = await Account.findOne({
        userId: to
    }).session(session);

    if(!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Invalid Account"
        });
    };

    // transfer 
    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    }).session(session);

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    }).session(session);


    // commit transaction
    await session.commitTransaction();
    res.json({
        msg: "Transaction successful!"
    });
});

module.exports = router;