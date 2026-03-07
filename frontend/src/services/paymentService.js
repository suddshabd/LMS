import api from './api';

const paymentService = {
    // Create payment intent
    createPaymentIntent: async (amount, pdfId) => {
        return api.post('/payments/intent', { amount, pdfId });
    },

    // Process payment
    processPayment: async (paymentData) => {
        return api.post('/payments/process', paymentData);
    },

    // Verify payment
    verifyPayment: async (paymentId) => {
        return api.get(`/payments/${paymentId}/verify`);
    },

    // Get payment history
    getPaymentHistory: async (userId) => {
        return api.get(`/users/${userId}/payments`);
    },

    // Refund payment
    refundPayment: async (paymentId, reason) => {
        return api.post(`/payments/${paymentId}/refund`, { reason });
    }
};

export default paymentService;
