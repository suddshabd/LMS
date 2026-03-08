import Joi from "joi";

export const syncUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().max(100).allow("", null),
  lastName: Joi.string().max(100).allow("", null),
  imageUrl: Joi.string().uri().allow("", null),
});

export const makeAdminSchema = Joi.object({
  secretKey: Joi.string().min(4).required(),
});

export const createOrderSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  couponCode: Joi.string().max(40).allow("", null),
});

export const verifyPaymentSchema = Joi.object({
  orderId: Joi.string().min(5).required(),
});

export const courseQuerySchema = Joi.object({
  category: Joi.string().valid("Banking", "SSC", "Government", "General"),
  search: Joi.string().max(100).allow(""),
  sort: Joi.string().valid("price", "rating", "newest", "students"),
  instructor: Joi.string().hex().length(24),
});

export const updateCourseSchema = Joi.object({
  title: Joi.string().max(200),
  category: Joi.string().valid("Banking", "SSC", "Government", "General"),
  subcategory: Joi.string().max(120).allow(""),
  price: Joi.number().min(0),
  discount: Joi.number().min(0).max(100),
  description: Joi.string().max(4000).allow(""),
  pages: Joi.number().integer().min(0),
  features: Joi.array().items(Joi.string().max(120)).max(30),
}).min(1);

export const mongoIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const courseIdParamSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
});

export const reviewIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const createCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(40).required(),
  type: Joi.string().valid("percent", "fixed").default("percent"),
  value: Joi.number().min(0).required(),
  startAt: Joi.date().optional(),
  endAt: Joi.date().optional(),
  maxUses: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
});

export const updateCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(40),
  type: Joi.string().valid("percent", "fixed"),
  value: Joi.number().min(0),
  startAt: Joi.date().allow(null),
  endAt: Joi.date().allow(null),
  maxUses: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
}).min(1);

export const createReviewSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow(""),
});

export const moderateReviewSchema = Joi.object({
  status: Joi.string().valid("approved", "rejected").required(),
});

export const upsertProgressSchema = Joi.object({
  lastOpenedPage: Joi.number().integer().min(1).required(),
  percentComplete: Joi.number().min(0).max(100).required(),
});

export const progressQuerySchema = Joi.object({
  courseIds: Joi.string().pattern(/^([a-fA-F0-9]{24})(,[a-fA-F0-9]{24})*$/).allow(""),
});

export const wishlistCreateSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
});
