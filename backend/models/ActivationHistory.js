import mongoose from 'mongoose';

const activationHistorySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  adminEmail: { type: String, required: true },
  adminDepartment: { type: String, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  type: { type: String, enum: ['plan', 'emergency'], default: 'plan' },
  planName: { type: String, default: '' },
  months: { type: Number, default: null },
  // for emergency: duration in readable form
  emergencyDuration: { type: String, default: '' },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  nonce: { type: String, required: true, unique: true },
  status: { type: String, enum: ['issued', 'used', 'expired'], default: 'issued' },
  usedAt: { type: Date, default: null },
}, { timestamps: false });

export default mongoose.model('ActivationHistory', activationHistorySchema);
