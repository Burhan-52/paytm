import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { tokenVerification } from "../middlewares/auth.js";
import { JWT_SECRET } from "../config.js";
import { z } from "zod";
import Account from "../models/Account.js";

const router = express.Router();

//Sign up Route
const signupBody = z.object({
  userName: z.string().trim().toLowerCase().min(5).max(30),
  password: z.string().min(6),
});

router.post("/signup", async (req, res) => {
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const existingUser = await User.findOne({ userName: req.body.userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "user already exists" });
    }

    const newUser = await new User({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    }).save();

    const userId = newUser._id;

    await new Account({
      userId,
      balance: 1 + Math.random() * 10000,
    }).save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

    res.status(201).json({
      success: true,
      token,
      message: "Congratulations! Your account has been created successfully.",
    });
  } catch (error) {
    console.log(error);
  }
});

//Sign In Route
const signinBody = z.object({
  userName: z.string().trim().toLowerCase().min(5).max(30),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(6),
});

router.post("/signin", tokenVerification, async (req, res) => {
  try {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const existingUser = await User.findOne({
      userName: req.body.userName,
      password: req.body.password,
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);

    res.status(201).json({
      success: true,
      token,
      message: `Welcome back ${existingUser.userName}`,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const existingUser = await User.findOne({ userName: req.body.userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "user already exists" });
    }

    const newUser = await new User({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    }).save();

    const token = jwt.sign({ userName: req.body.userName }, JWT_SECRET);

    res.status(201).json({
      success: true,
      token,
      message: "Congratulations! Your account has been created successfully.",
    });
  } catch (error) {
    console.log(error);
  }
});

// User update Route for Firstname, Lastname & Password
const updateUsers = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(6),
});

router.put("/update/:username", tokenVerification, async (req, res) => {
  const { username } = req.params;
  const { success } = updateUsers.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const existingUser = await User.findOne({ userName: username });

  if (!existingUser) {
    return res
      .status(400)
      .json({ success: false, error: "Error while updating information" });
  }
  const updateUser = await User.updateOne(
    { userName: username },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
      },
    }
  );
  res.status(201).json({
    success: true,
    message: "updated Successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});
export default router;
