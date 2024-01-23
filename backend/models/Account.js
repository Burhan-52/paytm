import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  balance: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("account", accountSchema);
