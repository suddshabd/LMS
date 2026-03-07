// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Routes
export const ROUTES = {
    HOME: '/',
    EXPLORE: '/explore',
    PDF_DETAILS: '/pdf/:id',
    CHECKOUT: '/checkout',
    DASHBOARD: '/dashboard',
    CREATOR_PANEL: '/creator',
    ADMIN_PANEL: '/admin',
    NOT_FOUND: '/404'
};

// Categories
export const PDF_CATEGORIES = [
    'Technology',
    'Business',
    'Design',
    'Marketing',
    'Education',
    'Development',
    'Other'
];

// Price Ranges
export const PRICE_RANGES = [
    { label: 'All Prices', value: '' },
    { label: '$0 - $10', value: '0-10' },
    { label: '$10 - $20', value: '10-20' },
    { label: '$20 - $50', value: '20-50' },
    { label: '$50+', value: '50+' }
];

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    CREATOR: 'creator',
    USER: 'user'
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Default values
export const DEFAULT_THEME = 'light';
export const DEFAULT_LANGUAGE = 'en';
