import React, { useState, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';
import CreatorStats from '../components/dashboard/CreatorStats';
import EarningsChart from '../components/dashboard/EarningsChart';
import UploadForm from '../components/dashboard/UploadForm';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';

export default function Dashboard() {
    const { user } = useUser();
    const { theme } = useContext(AppContext);
    const [purchasedCourses] = useState([]);
    const [wishlist] = useState([]);

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
                    <p className="text-blue-100">Keep learning, keep growing</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <Card>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Courses Purchased</p>
                        <p className="text-3xl font-bold text-blue-600">{purchasedCourses.length}</p>
                    </Card>
                    <Card>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Total Spent</p>
                        <p className="text-3xl font-bold text-blue-600">₹{purchasedCourses.reduce((sum, c) => sum + c.price, 0)}</p>
                    </Card>
                    <Card>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Wishlist Items</p>
                        <p className="text-3xl font-bold text-blue-600">{wishlist.length}</p>
                    </Card>
                    <Card>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Avg Rating Viewed</p>
                        <p className="text-3xl font-bold text-blue-600">4.7 ★</p>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* Purchased Courses */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6">My Purchased Courses</h2>
                        {purchasedCourses.length > 0 ? (
                            <div className="space-y-4">
                                {purchasedCourses.map(course => (
                                    <Card key={course.id || course._id} hoverable>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge variant="primary">{course.category}</Badge>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Purchased {course.purchaseDate}</span>
                                                </div>
                                            </div>
                                            <span className="font-bold text-blue-600 text-lg">₹{course.price}</span>
                                        </div>
                                        <div className="flex gap-2 pt-4 border-t">
                                            <Button variant="primary" size="sm">View Course</Button>
                                            <Button variant="secondary" size="sm">Download</Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center py-12">
                                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>No courses purchased yet</p>
                                <a href="/explore" className="text-blue-600 hover:underline">Explore Courses →</a>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Quick Links */}
                        <Card>
                            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <Button variant="primary" size="sm" className="w-full">
                                    Browse Courses
                                </Button>
                                <Button variant="secondary" size="sm" className="w-full">
                                    Download Materials
                                </Button>
                                <Button variant="secondary" size="sm" className="w-full">
                                    View Certificates
                                </Button>
                            </div>
                        </Card>

                        {/* Learning Streak */}
                        <Card>
                            <h3 className="font-bold text-lg mb-4">📊 Learning Streak</h3>
                            <div className="text-center mb-4">
                                <p className="text-4xl font-bold text-orange-500">5</p>
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Days in a row</p>
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Keep it up! Your consistency will pay off.</p>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                            <div className="space-y-3 text-sm">
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>📖 Viewed SSC CGL - 2h ago</p>
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>💰 Purchased UPSC Guide - 1d ago</p>
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>✅ Completed Quiz - 2d ago</p>
                            </div>
                        </Card>
                    </aside>
                </div>

                {/* Wishlist Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {wishlist.map(course => (
                                <Card key={course.id || course._id} hoverable>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                                            <Badge variant="primary">{course.category}</Badge>
                                        </div>
                                        <span className="text-2xl">💝</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <span className="font-bold text-blue-600 text-lg">₹{course.price}</span>
                                        <Button variant="primary" size="sm">Add to Cart</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12">
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Your wishlist is empty</p>
                        </Card>
                    )}
                </div>

                {/* Recommendations */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
                    <Card className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-linear-to-r from-blue-50 to-indigo-50'}`}>
                        <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Based on your interests in Banking & SSC exams</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button variant="primary">View Recommendations</Button>
                            <Button variant="secondary">Browse All Courses</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
