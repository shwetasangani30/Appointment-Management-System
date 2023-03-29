const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentsSchema = new Schema({
  clientId: { required: true, type: Schema.Types.ObjectId, ref: "users" },
  appointeeId: { required: true, type: Schema.Types.ObjectId, ref: "users" },
  packageId: { required: true, type: Schema.Types.ObjectId, ref: "packages" },
  description: { required: true, type: String },
  appointmentDate: { required: true, type: Date },
  appointmentTime: { required: true, type: String },
  status: { required: true, type: Number, default: 0 }, // 0 - Pending, 1 - Approved, 2 - Rejected, 3 - cancelled, 4 - Auto cancelled by cron
  approvedBy: { type: Schema.Types.ObjectId, ref: "users" },
  rejectedBy: { type: Schema.Types.ObjectId, ref: "users" },
  cancelledBy: { type: Schema.Types.ObjectId, ref: "users" },
  cancelReason: { type: String },
  rejectReason: { type: String },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

const AppointmentSchema = mongoose.model("appointment", AppointmentsSchema);
module.exports = { AppointmentSchema };
