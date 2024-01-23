import mongoose from "mongoose";

const connectToMongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/paytm");
    console.log("connected Succesfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;
