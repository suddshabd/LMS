import Review from '../models/Review.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

export const createReview = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { courseId, rating, comment } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const review = await Review.findOneAndUpdate(
      { course: courseId, user: user._id },
      { rating, comment, status: 'pending' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, data: review, message: 'Review submitted for moderation' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getApprovedReviews = async (req, res) => {
  try {
    const data = await Review.find({ course: req.params.courseId, status: 'approved' })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (status === 'approved') {
      const stats = await Review.aggregate([
        { $match: { course: review.course, status: 'approved' } },
        { $group: { _id: '$course', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);

      if (stats[0]) {
        await Course.findByIdAndUpdate(review.course, {
          rating: Number(stats[0].avgRating.toFixed(1)),
          reviews: stats[0].count,
        });
      }
    }

    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
