import mongoose from 'mongoose';

// One record per admin per day — used to detect clock rollbacks
const timeLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  day: { type: String, required: true },          // "YYYY-MM-DD"
  recordedAt: { type: Date, default: Date.now },   // immutable after creation
}, { timestamps: false });

timeLogSchema.index({ adminId: 1, day: 1 }, { unique: true });

export default mongoose.model('TimeLog', timeLogSchema);
