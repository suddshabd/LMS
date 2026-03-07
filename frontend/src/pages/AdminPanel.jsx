import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/apiService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PdfCard from '../components/pdf/PdfCard';
import { AppContext } from '../context/AppContext';

export default function AdminPanel() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const { theme, appUser } = useContext(AppContext);
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ courses: 0, revenue: 0, students: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        } catch (err) {
            console.error('Failed to fetch admin courses:', err);
            setError('Failed to load uploaded courses.');
        } finally {
            setLoading(false);
        }
    }, [appUser?._id]);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        loadCourses();
    }, [user, navigate, loadCourses]);

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const token = await getToken();
                await courseAPI.deleteCourse(id, token);
                await loadCourses();
            } catch (err) {
                console.error('Failed to delete course:', err);
                setError('Failed to delete course.');
            }
        }
    };

    const handleEditCourse = (courseId) => {
        navigate(`/admin/upload?edit=${courseId}`);
    };

    const handleCleanupNonOwned = async () => {
        if (!window.confirm("Delete all active courses not uploaded by your admin account?")) {
            return;
        }

        try {
            const token = await getToken();
            await courseAPI.deleteNonOwnedCourses(token);
            await loadCourses();
        } catch (err) {
            console.error("Failed to cleanup non-owned courses:", err);
            setError("Failed to cleanup non-owned courses.");
        }
    };

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
                Loading admin data...
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
                    <Button variant="danger" onClick={handleCleanupNonOwned}>
                        Delete Courses Not Uploaded By Me
                    </Button>
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

                {/* Courses Grid */}
                <div>
                    <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Your Courses
                    </h2>

                    {courses.length === 0 ? (
                        <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                            <div className="p-12 text-center">
                                <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    No courses uploaded yet
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/admin/upload')}
                                >
                                    Upload Your First Course
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <div key={course._id} className="group">
                                    <PdfCard pdf={course} />
                                    <div className="flex gap-3 mt-3">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleEditCourse(course._id)}
                                            className="flex-1"
                                        >
                                            ✏️ Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteCourse(course._id)}
                                            className="flex-1"
                                        >
                                            🗑️ Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
