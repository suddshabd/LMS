import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { courseAPI } from '../services/apiService'; // Import courseAPI
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PdfCard from '../components/pdf/PdfCard';
import Loader from '../components/ui/Loader'; // Assuming a Loader component exists

export default function AdminPanel() {
    const { clerkUser, appUser, loadingAppUser, isAuthenticated, theme } = useContext(AppContext);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ courses: 0, revenue: 0, students: 0 });
    const [loadingCourses, setLoadingCourses] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || loadingAppUser) {
            // Wait for authentication and appUser data to load
            return;
        }
        // ProtectedRoute already ensures appUser.role === 'admin' here
        loadCourses();
    }, [isAuthenticated, loadingAppUser, appUser]); // Depend on isAuthenticated and loadingAppUser

    const loadCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await courseAPI.getAllCourses(); // Fetch all courses from backend
            if (response.success) {
                setCourses(response.data);

                const totalRevenue = response.data.reduce((sum, course) => sum + (course.price || 0), 0);
                const totalStudents = response.data.reduce((sum, course) => sum + (course.students || 0), 0);

                setStats({
                    courses: response.data.length,
                    revenue: totalRevenue,
                    students: totalStudents
                });
            } else {
                console.error("Failed to fetch courses:", response.error);
                setCourses([]);
            }
        } catch (error) {
            console.error("Error loading courses:", error);
            setCourses([]);
        } finally {
            setLoadingCourses(false);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const response = await courseAPI.deleteCourse(id); // Delete course via backend
                if (response.success) {
                    loadCourses(); // Reload courses after deletion
                } else {
                    console.error("Failed to delete course:", response.error);
                }
            } catch (error) {
                console.error("Error deleting course:", error);
            }
        }
    };

    const handleEditCourse = (courseId) => {
        navigate(`/admin/upload?edit=${courseId}`);
    };

    // This block is now handled by ProtectedRoute
    // if (!isAuthenticated) {
    //     return (
    //         <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center`}>
    //             <div className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
    //                 <p className="text-xl mb-4">Please log in to access the admin panel</p>
    //                 <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
    //             </div>
    //         </div>
    //     );
    // }

    if (loadingCourses) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center`}>
                <Loader />
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
                            Welcome, {clerkUser?.firstName}!
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
                                <div key={course._id} className="group"> {/* Use _id from MongoDB */}
                                    <PdfCard course={course} />
                                    <div className="flex gap-3 mt-3">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleEditCourse(course._id)} // Use _id
                                            className="flex-1"
                                        >
                                            ✏️ Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteCourse(course._id)} // Use _id
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
revenue: totalRevenue,
    students: totalStudents
        });
    };

const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
        uploadService.deleteCourse(id);
        loadCourses();
    }
};

const handleEditCourse = (courseId) => {
    navigate(`/admin/upload?edit=${courseId}`);
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
                                <PdfCard course={course} />
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
