import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    minLength: 5,
    maxLength: 30,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

export default mongoose.model("user", userSchema);
