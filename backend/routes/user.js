import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { tokenVerification } from "../middlewares/auth.js";
import { JWT_SECRET } from "../config.js";
import { z } from "zod";

const router = express.Router();

const userSchema = z.object({
  userName: z.string().trim().toLowerCase().min(5).max(30),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(6),
});

//Sign In Route
router.post("/signin", async (req, res) => {
  try {
    const { userName, firstName, lastName, password } = userSchema.parse(
      req.body
    );

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "user already exists" });
    }

    const newUser = await new User({
      userName,
      firstName,
      lastName,
      password,
    }).save();

    const token = jwt.sign({ userName }, JWT_SECRET);

    res.status(201).json({
      success: true,
      token,
      message: "Congratulations! Your account has been created successfully.",
    });
  } catch (error) {
    console.log(error);
  }
});

//Sign up Route
router.post("/signup", tokenVerification, async (req, res) => {
  try {
    const { userName } = userSchema.parse(req.body);

    const existingUser = await User.findOne({ userName });

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "user already exists" });
    }

    const token = jwt.sign({ userName }, JWT_SECRET);

    res.status(201).json({
      success: true,
      token,
      message: `Welcome back ${existingUser.name}`,
    });
  } catch (error) {
    console.log(error);
  }
});

// User update Route for Firstname, Lastname & Password
router.put("/update/:fname", tokenVerification, async (req, res) => {
  const { fname } = req.params;
  const { userName, firstName, lastName, password } = userSchema.parse(
    req.body
  );
  const existingUser = await User.findOne({ userName: fname });

  if (!existingUser) {
    return res
      .status(400)
      .json({ success: false, error: "user already exists" });
  }
  const updateUser = await User.updateOne(
    { userName: fname },
    { $set: { userName, firstName, lastName, password } }
  );
  res.status(201).json({
    success: true,
    message: "updated Successfuuly",
  });
});
export default router;
