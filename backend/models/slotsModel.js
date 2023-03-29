const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SlotsSchema = new Schema({
  user_id: [{ required: true, type: Schema.Types.ObjectId, ref: "users" }],
  day: {
    required: true,
    type: String,
  },
  isHoliday: { required: true, type: Boolean, default: true },
  slots: { required: true, type: Array },
  timeGap: {
    required: true,
    type: Number,
    min: 1,
    max: 60,
    default: 30, // in minute and should be less then or equal to 60
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const SlotSchema = mongoose.model("slots", SlotsSchema);
module.exports = { SlotSchema };
