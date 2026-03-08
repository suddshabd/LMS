export const getFinalPrice = (price, discount = 0) => {
  const safePrice = Number.isFinite(Number(price)) ? Math.max(0, Number(price)) : 0;
  const safeDiscount = Number.isFinite(Number(discount)) ? Math.min(100, Math.max(0, Number(discount))) : 0;
  return Math.max(0, Math.round(safePrice * (1 - safeDiscount / 100)));
};
