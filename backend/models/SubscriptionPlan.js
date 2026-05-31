import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },        // e.g. "Basic", "Standard", "Pro"
  months: { type: Number, required: true },       // 6, 12, 24
  price: { type: Number, required: true },        // display price (offline)
  description: { type: String, default: '' },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
