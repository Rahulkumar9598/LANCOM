import mongoose from 'mongoose';

// Stores every used activation nonce so a file can't be reused
const usedNonceSchema = new mongoose.Schema({
  nonce: { type: String, required: true, unique: true },
  adminId: { type: String, required: true },
  usedAt: { type: Date, default: Date.now },
});

export default mongoose.model('UsedNonce', usedNonceSchema);
