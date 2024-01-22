import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    unique:true,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("user", userSchema);
