import Progress from '../models/Progress.js';
import User from '../models/User.js';

export const upsertProgress = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { courseId } = req.params;
    const { lastOpenedPage = 1, percentComplete = 0 } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { user: user._id, course: courseId },
      { lastOpenedPage, percentComplete, lastAccessedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, data: progress });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { courseId } = req.params;
    const progress = await Progress.findOne({ user: user._id, course: courseId });

    return res.status(200).json({ success: true, data: progress || null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBulkProgress = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const courseIds = String(req.query.courseIds || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!courseIds.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const progress = await Progress.find({
      user: user._id,
      course: { $in: courseIds },
    });

    return res.status(200).json({ success: true, data: progress });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
