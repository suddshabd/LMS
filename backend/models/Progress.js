import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    lastOpenedPage: { type: Number, default: 1, min: 1 },
    percentComplete: { type: Number, default: 0, min: 0, max: 100 },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
