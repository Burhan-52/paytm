import express from "express";
import connectToMongo from "./db.js";
import userRouter from "./routes/user.js";
import accountRouter from "./routes/account.js";
import { PORT } from "./config.js";
import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());

connectToMongo();

app.use("/api/v1", userRouter);
app.use("/api/v1", accountRouter);

app.listen(PORT, () => {
  console.log(`Your app is running port number ${PORT}`);
});
