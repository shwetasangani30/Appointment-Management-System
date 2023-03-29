const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupportsSchema = new Schema({
  sender_id: { required: true, type: Schema.Types.ObjectId, ref: "users" },
  receiver_id: { required: true, type: Schema.Types.ObjectId, ref: "users" },
  message: {
    required: true,
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const SupportSchema = mongoose.model("support", SupportsSchema);
module.exports = { SupportSchema };
