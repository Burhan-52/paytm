import express from "express";
import Account from "../models/Account.js";
import { tokenVerification } from "../middlewares/auth.js";

const router = express.Router();

router.get("/account/balance", tokenVerification, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", tokenVerification, async (req, res) => {
  const { to, amount } = req.body;

  const account = await Account.findOne({ userId: req.userId });

  if (!account || account.balance < amount) {
    res.status(400).json({ message: "Insufficient balance" });
  }

  const toAccount = await Account.findOne({ userId: to });
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  await Account.updateOne({ userId: to }, { $inc: { balance: amount } });

  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  );

  res.json({
    message: "Transfer successfull",
  });
});

export default router;
