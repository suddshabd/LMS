const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const getDiscountedPrice = (price, discount) => {
    const basePrice = Math.max(0, toNumber(price));
    const pct = Math.min(100, Math.max(0, toNumber(discount)));
    return Math.max(0, Math.round(basePrice * (1 - pct / 100)));
};

export const getCoursePricing = (course) => {
    const originalPrice = Math.max(0, toNumber(course?.price));
    const discount = Math.min(100, Math.max(0, toNumber(course?.discount)));
    const finalPrice = getDiscountedPrice(originalPrice, discount);
    const hasDiscount = discount > 0 && finalPrice < originalPrice;

    return {
        originalPrice,
        finalPrice,
        discount,
        hasDiscount,
    };
};
