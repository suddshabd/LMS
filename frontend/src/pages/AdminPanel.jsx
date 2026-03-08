import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, couponAPI, courseAPI } from '../services/apiService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import { AppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import useDebouncedValue from '../hooks/useDebouncedValue';

export default function AdminPanel() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const { theme, appUser } = useContext(AppContext);
    const { showToast } = useToast();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ courses: 0, revenue: 0, students: 0 });
    const [analytics, setAnalytics] = useState({
        totalPurchases: 0,
        repeatBuyers: 0,
        conversionRate: 0,
        topCategories: [],
    });
    const [coupons, setCoupons] = useState([]);
    const [couponForm, setCouponForm] = useState({
        code: '',
        type: 'percent',
        value: '',
        maxUses: '',
    });
    const [couponLoading, setCouponLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 8;
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

    const loadAdminAnalytics = useCallback(async () => {
        try {
            const token = await getToken();
            const response = await adminAPI.getInstructorAnalytics(token);
            if (response?.success && response?.data) {
                setAnalytics({
                    totalPurchases: Number(response.data.totalPurchases) || 0,
                    repeatBuyers: Number(response.data.repeatBuyers) || 0,
                    conversionRate: Number(response.data.conversionRate) || 0,
                    topCategories: Array.isArray(response.data.topCategories) ? response.data.topCategories : [],
                });
            }
        } catch {
            showToast('Failed to load analytics', 'error');
        }
    }, [getToken, showToast]);

    const loadCoupons = useCallback(async () => {
        try {
            const response = await couponAPI.getCoupons();
            setCoupons(response?.success ? response.data : []);
        } catch {
            showToast('Failed to load coupons', 'error');
        }
    }, [showToast]);

    const loadCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const params =
                appUser?._id ? { instructor: appUser._id } : {};
            const response = await courseAPI.getAllCourses(params);
            const uploadedCourses = response?.success ? response.data : [];
            setCourses(uploadedCourses);

            const totalRevenue = uploadedCourses.reduce((sum, course) => sum + (Number(course.price) || 0), 0);
            const totalStudents = uploadedCourses.reduce((sum, course) => sum + (Number(course.students) || 0), 0);

            setStats({
                courses: uploadedCourses.length,
                revenue: totalRevenue,
                students: totalStudents
            });
        } catch {
            setError('Failed to load uploaded courses.');
            showToast('Failed to load uploaded courses', 'error');
        } finally {
            setLoading(false);
        }
    }, [appUser?._id, showToast]);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        loadCourses();
        loadAdminAnalytics();
        loadCoupons();
    }, [user, navigate, loadCourses, loadAdminAnalytics, loadCoupons]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, sortBy]);

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const token = await getToken();
                await courseAPI.deleteCourse(id, token);
                await loadCourses();
                showToast('Course deleted', 'success');
            } catch {
                setError('Failed to delete course.');
                showToast('Failed to delete course', 'error');
            }
        }
    };

    const handleEditCourse = (course) => {
        navigate(`/admin/upload/${course._id}`, {
            state: {
                editCourseId: course._id,
                courseData: course,
            },
        });
    };

    const handleCleanupNonOwned = async () => {
        if (!window.confirm("Delete all active courses not uploaded by your admin account?")) {
            return;
        }

        try {
            const token = await getToken();
            await courseAPI.deleteNonOwnedCourses(token);
            await loadCourses();
            showToast('Cleanup completed', 'success');
        } catch {
            setError("Failed to cleanup non-owned courses.");
            showToast('Failed to cleanup non-owned courses', 'error');
        }
    };

    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        try {
            setCouponLoading(true);
            const payload = {
                code: couponForm.code.trim().toUpperCase(),
                type: couponForm.type,
                value: Number(couponForm.value),
                maxUses: couponForm.maxUses ? Number(couponForm.maxUses) : 0,
            };

            if (!payload.code || Number.isNaN(payload.value)) {
                throw new Error('Coupon code and value are required');
            }

            const response = await couponAPI.createCoupon(payload);
            if (!response?.success) {
                throw new Error(response?.message || 'Failed to create coupon');
            }

            showToast('Coupon created', 'success');
            setCouponForm({ code: '', type: 'percent', value: '', maxUses: '' });
            await loadCoupons();
        } catch (err) {
            showToast(err.message || 'Failed to create coupon', 'error');
        } finally {
            setCouponLoading(false);
        }
    };

    const toggleCouponStatus = async (coupon) => {
        try {
            const response = await couponAPI.updateCoupon(coupon._id, { isActive: !coupon.isActive });
            if (!response?.success) {
                throw new Error(response?.message || 'Failed to update coupon');
            }
            showToast('Coupon updated', 'success');
            await loadCoupons();
        } catch (err) {
            showToast(err.message || 'Failed to update coupon', 'error');
        }
    };

    const exportCoursesCsv = () => {
        if (!courses.length) return;

        const headers = ['Title', 'Category', 'Price', 'Discount', 'FinalPrice', 'Students', 'CreatedAt'];
        const rows = courses.map((course) => {
            const price = Number(course.price) || 0;
            const discount = Number(course.discount) || 0;
            const finalPrice = Math.max(0, Math.round(price * (1 - discount / 100)));
            return [
                `"${(course.title || '').replaceAll('"', '""')}"`,
                `"${course.category || ''}"`,
                price,
                discount,
                finalPrice,
                Number(course.students) || 0,
                course.createdAt || '',
            ].join(',');
        });

        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `admin-courses-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const filteredCourses = courses
        .filter((course) => {
            const byCategory =
                categoryFilter === 'all' || String(course.category).toLowerCase() === categoryFilter.toLowerCase();
            const searchText = `${course.title || ''} ${course.subcategory || ''}`.toLowerCase();
            const bySearch = !debouncedSearchQuery || searchText.includes(debouncedSearchQuery.toLowerCase());
            return byCategory && bySearch;
        })
        .sort((a, b) => {
            if (sortBy === 'price-high') return (Number(b.price) || 0) - (Number(a.price) || 0);
            if (sortBy === 'price-low') return (Number(a.price) || 0) - (Number(b.price) || 0);
            if (sortBy === 'students-high') return (Number(b.students) || 0) - (Number(a.students) || 0);
            if (sortBy === 'discount-high') return (Number(b.discount) || 0) - (Number(a.discount) || 0);
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
    const pagedCourses = filteredCourses.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );
    const categories = ['all', ...new Set(courses.map((course) => course.category).filter(Boolean))];

    if (!user) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className="text-xl mb-4">Please log in to access the admin panel</p>
                    <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-gray-300' : 'bg-gray-50 text-gray-700'} flex items-center justify-center`}>
                <div className="flex flex-col items-center gap-4">
                    <Loader />
                    <p>Loading admin data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} py-12`}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Welcome, {user.firstName}!
                        </h1>
                        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage your course uploads and sales
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/admin/upload')}
                    >
                        + Upload Course
                    </Button>
                </div>

                <div className="mb-6">
                    <div className="flex flex-wrap gap-3">
                        <Button variant="danger" onClick={handleCleanupNonOwned}>
                            Delete Courses Not Uploaded By Me
                        </Button>
                        <Button variant="secondary" onClick={loadCourses}>
                            Refresh
                        </Button>
                        <Button variant="secondary" onClick={exportCoursesCsv}>
                            Export CSV
                        </Button>
                    </div>
                </div>

                {error && (
                    <Card className="mb-6 border border-red-300 bg-red-100 text-red-700">
                        {error}
                    </Card>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className="p-6">
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                My Courses
                            </p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                {stats.courses}
                            </p>
                        </div>
                    </Card>

                    <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-green-50 border border-green-200'}`}>
                        <div className="p-6">
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Total Revenue
                            </p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                ₹{stats.revenue}
                            </p>
                        </div>
                    </Card>

                    <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-purple-50 border border-purple-200'}`}>
                        <div className="p-6">
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Total Students
                            </p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                                {stats.students}
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-indigo-50 border border-indigo-200'}`}>
                        <div className="p-6">
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Total Purchases
                            </p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                {analytics.totalPurchases}
                            </p>
                        </div>
                    </Card>
                    <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-amber-50 border border-amber-200'}`}>
                        <div className="p-6">
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Repeat Buyers
                            </p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
                                {analytics.repeatBuyers}
                            </p>
                        </div>
                    </Card>
                    <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-rose-50 border border-rose-200'}`}>
                        <div className="p-6">
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Repeat Conversion
                            </p>
                            <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-rose-300' : 'text-rose-700'}`}>
                                {analytics.conversionRate}%
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-4">Top Categories</h3>
                            {!analytics.topCategories.length ? (
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No sales data yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {analytics.topCategories.map((item) => (
                                        <li key={item.category} className="flex justify-between">
                                            <span>{item.category}</span>
                                            <span className="font-semibold">{item.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Card>

                    <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-4">Coupon Manager</h3>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4" onSubmit={handleCouponSubmit}>
                                <input
                                    value={couponForm.code}
                                    onChange={(e) => setCouponForm((prev) => ({ ...prev, code: e.target.value }))}
                                    placeholder="Code (e.g. NEW20)"
                                    className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-950 border-gray-700 text-gray-100'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                                <select
                                    value={couponForm.type}
                                    onChange={(e) => setCouponForm((prev) => ({ ...prev, type: e.target.value }))}
                                    className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-950 border-gray-700 text-gray-100'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="percent">Percent</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                                <input
                                    type="number"
                                    min="0"
                                    value={couponForm.value}
                                    onChange={(e) => setCouponForm((prev) => ({ ...prev, value: e.target.value }))}
                                    placeholder="Value"
                                    className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-950 border-gray-700 text-gray-100'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={couponForm.maxUses}
                                    onChange={(e) => setCouponForm((prev) => ({ ...prev, maxUses: e.target.value }))}
                                    placeholder="Max uses (0 = unlimited)"
                                    className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-950 border-gray-700 text-gray-100'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                                <Button type="submit" variant="primary" disabled={couponLoading} className="md:col-span-2">
                                    {couponLoading ? 'Saving...' : 'Create Coupon'}
                                </Button>
                            </form>

                            <div className="space-y-2 max-h-52 overflow-auto">
                                {coupons.map((coupon) => (
                                    <div key={coupon._id} className={`rounded-lg px-3 py-2 flex items-center justify-between ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
                                        <div>
                                            <p className="font-semibold">{coupon.code}</p>
                                            <p className={theme === 'dark' ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'}>
                                                {coupon.type === 'percent' ? `${coupon.value}%` : `₹${coupon.value}`} | used {coupon.usedCount}/{coupon.maxUses || '∞'}
                                            </p>
                                        </div>
                                        <Button
                                            variant={coupon.isActive ? 'secondary' : 'primary'}
                                            size="sm"
                                            onClick={() => toggleCouponStatus(coupon)}
                                        >
                                            {coupon.isActive ? 'Disable' : 'Enable'}
                                        </Button>
                                    </div>
                                ))}
                                {!coupons.length && (
                                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No coupons yet.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Courses Table */}
                <div>
                    <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Your Courses
                    </h2>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title or subcategory"
                            className={`px-4 py-2 rounded-lg border min-w-72 ${theme === 'dark'
                                ? 'bg-gray-900 border-gray-700 text-gray-100'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-900 border-gray-700 text-gray-100'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-900 border-gray-700 text-gray-100'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        >
                            <option value="newest">Newest</option>
                            <option value="price-high">Price High → Low</option>
                            <option value="price-low">Price Low → High</option>
                            <option value="students-high">Most Students</option>
                            <option value="discount-high">Highest Discount</option>
                        </select>
                    </div>

                    {filteredCourses.length === 0 ? (
                        <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                            <div className="p-12 text-center">
                                <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    No matching courses found
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/admin/upload')}
                                >
                                    Upload New Course
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className={`overflow-x-auto rounded-xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                            <table className="min-w-full text-sm">
                                <thead className={theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}>
                                    <tr>
                                        <th className="px-4 py-3 text-left">Title</th>
                                        <th className="px-4 py-3 text-left">Category</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-right">Discount</th>
                                        <th className="px-4 py-3 text-right">Final Price</th>
                                        <th className="px-4 py-3 text-right">Students</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-white text-gray-900'}>
                                    {pagedCourses.map((course) => {
                                        const price = Number(course.price) || 0;
                                        const discount = Number(course.discount) || 0;
                                        const finalPrice = Math.max(0, Math.round(price * (1 - discount / 100)));

                                        return (
                                            <tr key={course._id} className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                                <td className="px-4 py-3 font-medium">{course.title}</td>
                                                <td className="px-4 py-3">{course.category}</td>
                                                <td className="px-4 py-3 text-right">₹{price}</td>
                                                <td className="px-4 py-3 text-right">{discount}%</td>
                                                <td className="px-4 py-3 text-right font-semibold text-green-500">₹{finalPrice}</td>
                                                <td className="px-4 py-3 text-right">{Number(course.students) || 0}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2 justify-center">
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => handleEditCourse(course)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleDeleteCourse(course._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filteredCourses.length > PAGE_SIZE && (
                        <div className="mt-5 flex items-center justify-between">
                            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                Showing {(currentPage - 1) * PAGE_SIZE + 1}-
                                {Math.min(currentPage * PAGE_SIZE, filteredCourses.length)} of {filteredCourses.length}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                >
                                    Prev
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
