import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    value: { type: Number, required: true, min: 0 },
    startAt: { type: Date },
    endAt: { type: Date },
    maxUses: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValidNow = function isValidNow() {
  const now = new Date();
  if (!this.isActive) return false;
  if (this.startAt && now < this.startAt) return false;
  if (this.endAt && now > this.endAt) return false;
  if (this.maxUses > 0 && this.usedCount >= this.maxUses) return false;
  return true;
};

export default mongoose.model('Coupon', couponSchema);
