import React, { useState } from 'react';
import { paymentAPI } from '../../services/apiService';

export default function CashfreePayment({ course, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [payableAmount, setPayableAmount] = useState(Number(course?.price) || 0);

    const loadCashfreeScript = () => {
        return new Promise((resolve) => {
            const existingScript = document.querySelector(
                'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]'
            );

            if (existingScript) {
                if (window.Cashfree) {
                    resolve(true);
                    return;
                }

                existingScript.addEventListener('load', () => resolve(true), { once: true });
                existingScript.addEventListener('error', () => resolve(false), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError('');

            // Load Cashfree script
            const scriptLoaded = await loadCashfreeScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load Cashfree SDK. Check CSP and network policy.');
            }

            // Create order
            const orderResponse = await paymentAPI.createOrder(course._id, couponCode.trim().toUpperCase());

            if (!orderResponse.success) {
                throw new Error(orderResponse.message || 'Unable to create order');
            }

            const { orderId, paymentSessionId } = orderResponse.data;
            setPayableAmount(Number(orderResponse.data?.amount) || Number(course?.price) || 0);

            if (!paymentSessionId) {
                throw new Error('Cashfree payment session not received from backend');
            }

            const mode = import.meta.env.VITE_CASHFREE_ENV || 'sandbox';
            const cashfree = window.Cashfree({ mode });
            const checkoutResult = await cashfree.checkout({
                paymentSessionId,
                redirectTarget: '_modal',
            });

            if (checkoutResult?.error) {
                throw new Error(checkoutResult.error.message || 'Cashfree checkout failed');
            }

            const verifyResponse = await paymentAPI.verifyPayment({ orderId });
            if (!verifyResponse.success) {
                throw new Error(verifyResponse.message || 'Payment verification failed');
            }

            onSuccess(verifyResponse);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code (optional)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />

            <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
            >
                {loading ? 'Processing...' : `Pay ₹${payableAmount} with Cashfree`}
            </button>
        </div>
    );
}
