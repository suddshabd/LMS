import User from '../models/User.js';

const getUserByClerkId = async (clerkId) => User.findOne({ clerkId }).populate('wishlistCourses');

export const getWishlist = async (req, res) => {
  try {
    const user = await getUserByClerkId(req.auth?.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user.wishlistCourses || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth?.userId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { courseId } = req.body;
    if (!user.wishlistCourses.some((id) => id.toString() === String(courseId))) {
      user.wishlistCourses.push(courseId);
      await user.save();
    }

    const populated = await getUserByClerkId(req.auth?.userId);
    return res.status(200).json({ success: true, data: populated.wishlistCourses || [] });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth?.userId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.wishlistCourses = user.wishlistCourses.filter((id) => id.toString() !== String(req.params.courseId));
    await user.save();

    const populated = await getUserByClerkId(req.auth?.userId);
    return res.status(200).json({ success: true, data: populated.wishlistCourses || [] });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
