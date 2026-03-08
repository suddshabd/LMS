import Coupon from '../models/Coupon.js';

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    return res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const data = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Coupon not found' });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
