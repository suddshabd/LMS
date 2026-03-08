import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { paymentAPI, progressAPI } from '../services/apiService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { AppContext } from '../context/AppContext';
import useDebouncedValue from '../hooks/useDebouncedValue';
import { useToast } from '../context/ToastContext';

const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    return new Date(isoDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export default function Dashboard() {
    const { user } = useUser();
    const { theme } = useContext(AppContext);
    const { showToast } = useToast();

    const [payments, setPayments] = useState([]);
    const [progressByCourse, setProgressByCourse] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 8;
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

    useEffect(() => {
        const loadPayments = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await paymentAPI.getMyPayments();

                if (!response?.success) {
                    throw new Error(response?.message || 'Failed to load dashboard data');
                }

                setPayments(response.data || []);
            } catch (err) {
                setError(err.message || 'Failed to load dashboard data');
                showToast(err.message || 'Failed to load dashboard data', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
    }, [showToast]);

    const purchasedItems = useMemo(
        () => payments.filter((payment) => payment.status === 'captured' && payment.course),
        [payments]
    );

    const totalSpent = useMemo(
        () => purchasedItems.reduce((sum, payment) => sum + (Number(payment.amount) || Number(payment.course?.price) || 0), 0),
        [purchasedItems]
    );

    const uniqueCategories = useMemo(() => {
        const set = new Set(
            purchasedItems
                .map((payment) => payment.course?.category)
                .filter(Boolean)
        );
        return set.size;
    }, [purchasedItems]);

    useEffect(() => {
        const loadProgress = async () => {
            const courseIds = purchasedItems
                .map((item) => item.course?._id)
                .filter(Boolean);

            if (!courseIds.length) {
                setProgressByCourse({});
                return;
            }

            try {
                const response = await progressAPI.getBulkProgress(courseIds);
                const entries = response?.success ? response.data : [];
                const progressMap = entries.reduce((acc, item) => {
                    acc[String(item.course)] = item;
                    return acc;
                }, {});
                setProgressByCourse(progressMap);
            } catch {
                setProgressByCourse({});
            }
        };

        loadProgress();
    }, [purchasedItems]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, sortBy]);

    const exportPurchasedCsv = () => {
        if (!purchasedItems.length) return;

        const headers = ['Course', 'Category', 'Price', 'Students', 'PurchasedOn', 'Status'];
        const rows = purchasedItems.map((payment) => [
            `"${(payment.course?.title || '').replaceAll('"', '""')}"`,
            `"${payment.course?.category || ''}"`,
            Number(payment.amount) || Number(payment.course?.price) || 0,
            Number(payment.course?.students) || 0,
            formatDate(payment.createdAt),
            payment.status || '',
        ].join(','));

        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `my-purchased-courses-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const filteredPurchases = purchasedItems
        .filter((payment) => {
            const course = payment.course || {};
            const byCategory =
                categoryFilter === 'all' || String(course.category).toLowerCase() === categoryFilter.toLowerCase();
            const searchText = `${course.title || ''} ${course.category || ''}`.toLowerCase();
            const bySearch = !debouncedSearchQuery || searchText.includes(debouncedSearchQuery.toLowerCase());
            return byCategory && bySearch;
        })
        .sort((a, b) => {
            const priceA = Number(a.amount) || Number(a.course?.price) || 0;
            const priceB = Number(b.amount) || Number(b.course?.price) || 0;

            if (sortBy === 'price-high') return priceB - priceA;
            if (sortBy === 'price-low') return priceA - priceB;
            if (sortBy === 'students-high') return (Number(b.course?.students) || 0) - (Number(a.course?.students) || 0);
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

    const totalPages = Math.max(1, Math.ceil(filteredPurchases.length / PAGE_SIZE));
    const pagedPurchases = filteredPurchases.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );
    const categories = ['all', ...new Set(purchasedItems.map((payment) => payment.course?.category).filter(Boolean))];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader />
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.firstName || 'Learner'}!</h1>
                    <p className="text-blue-100">Track your purchased courses and payment details</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {error && (
                    <Card className="mb-6 border border-red-300 bg-red-100 text-red-700">
                        {error}
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <Card>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Courses Purchased</p>
                        <p className="text-3xl font-bold text-blue-600">{purchasedItems.length}</p>
                    </Card>
                    <Card>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Total Spent</p>
                        <p className="text-3xl font-bold text-blue-600">₹{totalSpent}</p>
                    </Card>
                    <Card>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Payment Records</p>
                        <p className="text-3xl font-bold text-blue-600">{payments.length}</p>
                    </Card>
                    <Card>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Categories Enrolled</p>
                        <p className="text-3xl font-bold text-blue-600">{uniqueCategories}</p>
                    </Card>
                </div>

                <h2 className="text-2xl font-bold mb-6">My Purchased Courses</h2>

                {purchasedItems.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by course title"
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
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
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
                            <option value="newest">Newest Purchase</option>
                            <option value="price-high">Price High → Low</option>
                            <option value="price-low">Price Low → High</option>
                            <option value="students-high">Most Students</option>
                        </select>
                        <Button variant="secondary" onClick={exportPurchasedCsv}>
                            Export CSV
                        </Button>
                    </div>
                )}

                {filteredPurchases.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                            {purchasedItems.length === 0
                                ? 'You have not purchased any courses yet.'
                                : 'No courses match your current filters.'}
                        </p>
                        <Link to="/explore" className="text-blue-600 hover:underline">Explore Courses →</Link>
                    </Card>
                ) : (
                    <div className={`overflow-x-auto rounded-xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                        <table className="min-w-full text-sm">
                            <thead className={theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}>
                                <tr>
                                    <th className="px-4 py-3 text-left">Course</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                    <th className="px-4 py-3 text-right">Students</th>
                                    <th className="px-4 py-3 text-center">Purchased On</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-center">Progress</th>
                                    <th className="px-4 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className={theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-white text-gray-900'}>
                                {pagedPurchases.map((payment) => {
                                    const course = payment.course;
                                    return (
                                        <tr key={payment._id} className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                            <td className="px-4 py-3 font-medium">{course?.title || 'Untitled course'}</td>
                                            <td className="px-4 py-3">{course?.category || 'N/A'}</td>
                                            <td className="px-4 py-3 text-right">₹{Number(payment.amount) || Number(course?.price) || 0}</td>
                                            <td className="px-4 py-3 text-right">{Number(course?.students) || 0}</td>
                                            <td className="px-4 py-3 text-center">{formatDate(payment.createdAt)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant="primary">{payment.status}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {progressByCourse[course?._id]?.percentComplete || 0}%
                                                <div className={theme === 'dark' ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'}>
                                                    Last page {progressByCourse[course?._id]?.lastOpenedPage || 1}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link to={`/pdf/${course?._id}`}>
                                                    <Button size="sm">View Course</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredPurchases.length > PAGE_SIZE && (
                    <div className="mt-5 flex items-center justify-between">
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Showing {(currentPage - 1) * PAGE_SIZE + 1}-
                            {Math.min(currentPage * PAGE_SIZE, filteredPurchases.length)} of {filteredPurchases.length}
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
    );
}
