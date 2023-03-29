const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PackagesSchema = new Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  description: {
    required: true,
    type: String,
    trim: true,
  },
  user_id: [{ required: true, type: Schema.Types.ObjectId, ref: "users" }],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const PackageSchema = mongoose.model("packages", PackagesSchema);
module.exports = { PackageSchema };
