import express from "express";
import connectToMongo from "./db.js";
import userRouter from "./routes/user.js";
import bodyParser from "body-parser";

const app = express();

const port = 8000;

app.use(express.json());
app.use(bodyParser.json());

connectToMongo();

app.use("/", userRouter);

app.listen(port, () => {
  console.log(`Your app is running port number ${port}`);
});
