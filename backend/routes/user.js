import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { tokenVerification } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;

    const existingUser = await User.findOne({ firstName, lastName });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "user already exists" });
    }
    const newUser = await new User({
      firstName,
      lastName,
      password,
    }).save();

    const token = jwt.sign({ firstName }, "paytm");

    res.status(201).json({
      success: true,
      newUser,
      token,
      message: "Congratulations! Your account has been created successfully.",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/signup", tokenVerification, async (req, res) => {
  try {
    const { firstName } = req.body;

    const existingUser = await User.findOne({ firstName });

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "user already exists" });
    }

    const token = jwt.sign({ firstName }, "paytm");

    res.status(201).json({
      success: true,
      existingUser,
      token,
      message: `Welcome back ${existingUser.name}`,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/update/:fname", tokenVerification, async (req, res) => {
  const { fname } = req.params;
  const { firstName, lastName, password } = req.body;
  const existingUser = await User.findOne({ firstName: fname });

  if (!existingUser) {
    return res
      .status(400)
      .json({ success: false, error: "user already exists" });
  }
  const updateUser = await User.updateOne(
    { firstName: fname },
    { $set: { firstName, lastName, password } }
  );
  res.status(201).json({
    success: true,
    updateUser,
  });
});
export default router;
