export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
};

export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US').format(new Date(date));
};

export const formatNumber = (number) => {
    return number.toLocaleString('en-US');
};
