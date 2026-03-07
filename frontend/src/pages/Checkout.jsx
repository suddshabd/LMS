import React, { useState, useContext } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';

export default function Checkout() {
    const { theme } = useContext(AppContext);
    const [cart] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState('credit-card');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className={`container mx-auto py-12 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            <h1 className="text-4xl font-bold mb-8">Checkout</h1>

            {cart.length === 0 && (
                <Card className="mb-8 text-center py-8">
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Your cart is empty.
                    </p>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-2">
                    <Card className="mb-6">
                        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center pb-4 border-b">
                                    <div>
                                        <p className="font-semibold">{item.title}</p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="credit-card"
                                    checked={paymentMethod === 'credit-card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-3"
                                />
                                <span>Credit Card</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="debit-card"
                                    checked={paymentMethod === 'debit-card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-3"
                                />
                                <span>Debit Card</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-3"
                                />
                                <span>PayPal</span>
                            </label>
                        </div>
                    </Card>
                </div>

                {/* Price Summary */}
                <aside>
                    <Card>
                        <h3 className="font-bold text-lg mb-4">Price Details</h3>
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Tax (10%)</span>
                                <span className="font-semibold">${tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between text-lg">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button variant="primary" size="lg" className="w-full">
                            Complete Purchase
                        </Button>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
