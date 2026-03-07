// import React, { useState, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import Card from '../components/ui/Card';
// import Badge from '../components/ui/Badge';
// import Button from '../components/ui/Button';

// export default function Explore() {
//     const [filters, setFilters] = useState({
//         category: 'all',
//         priceRange: 'all',
//         rating: 0,
//         search: ''
//     });
//     const [sortBy, setSortBy] = useState('popular');

//     // Filter and sort courses
//     const filteredCourses = useMemo(() => {
//         let result = courseData.filter(course => {
//             // Category filter
//             if (filters.category !== 'all' && course.category !== filters.category) {
//                 return false;
//             }

//             // Price filter
//             if (filters.priceRange !== 'all') {
//                 const [min, max] = filters.priceRange.split('-').map(Number);
//                 if (max) {
//                     if (course.price < min || course.price > max) return false;
//                 } else {
//                     if (course.price < min) return false;
//                 }
//             }

//             // Rating filter
//             if (filters.rating > 0 && course.rating < filters.rating) {
//                 return false;
//             }

//             // Search filter
//             if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase()) &&
//                 !course.description.toLowerCase().includes(filters.search.toLowerCase())) {
//                 return false;
//             }

//             return true;
//         });

//         // Sort
//         if (sortBy === 'price-low') {
//             result.sort((a, b) => a.price - b.price);
//         } else if (sortBy === 'price-high') {
//             result.sort((a, b) => b.price - a.price);
//         } else if (sortBy === 'rating') {
//             result.sort((a, b) => b.rating - a.rating);
//         } else if (sortBy === 'popular') {
//             result.sort((a, b) => b.students - a.students);
//         } else if (sortBy === 'newest') {
//             result.reverse();
//         }

//         return result;
//     }, [filters, sortBy]);

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-8 md:py-12">
//                 <div className="container mx-auto px-4">
//                     <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore All Courses</h1>
//                     <p className="text-blue-100">Find the perfect course to ace your exams</p>
//                 </div>
//             </div>

//             <div className="container mx-auto px-4 py-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                     {/* Sidebar - Filters */}
//                     <aside className="lg:col-span-1">
//                         <Card className="sticky top-20">
//                             <h3 className="font-bold text-lg mb-4">Filters</h3>

//                             {/* Search */}
//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium mb-2">Search</label>
//                                 <input
//                                     type="text"
//                                     value={filters.search}
//                                     onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                                     placeholder="Search courses..."
//                                     className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </div>

//                             {/* Category Filter */}
//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium mb-2">Category</label>
//                                 <div className="space-y-2">
//                                     {categories.map(cat => (
//                                         <label key={cat.value} className="flex items-center cursor-pointer">
//                                             <input
//                                                 type="radio"
//                                                 name="category"
//                                                 value={cat.value}
//                                                 checked={filters.category === cat.value}
//                                                 onChange={() => setFilters({ ...filters, category: cat.value })}
//                                                 className="mr-2"
//                                             />
//                                             <span className="text-sm">{cat.name}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Price Filter */}
//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium mb-2">Price Range</label>
//                                 <div className="space-y-2">
//                                     {priceRanges.map(range => (
//                                         <label key={range.value} className="flex items-center cursor-pointer">
//                                             <input
//                                                 type="radio"
//                                                 name="price"
//                                                 value={range.value}
//                                                 checked={filters.priceRange === range.value}
//                                                 onChange={() => setFilters({ ...filters, priceRange: range.value })}
//                                                 className="mr-2"
//                                             />
//                                             <span className="text-sm">{range.label}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Rating Filter */}
//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium mb-2">Rating</label>
//                                 <div className="space-y-2">
//                                     <label className="flex items-center cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             name="rating"
//                                             value={0}
//                                             checked={filters.rating === 0}
//                                             onChange={() => setFilters({ ...filters, rating: 0 })}
//                                             className="mr-2"
//                                         />
//                                         <span className="text-sm">All Ratings</span>
//                                     </label>
//                                     {ratingFilters.map((rate, idx) => (
//                                         <label key={idx} className="flex items-center cursor-pointer">
//                                             <input
//                                                 type="radio"
//                                                 name="rating"
//                                                 value={rate.value}
//                                                 checked={filters.rating === rate.value}
//                                                 onChange={() => setFilters({ ...filters, rating: rate.value })}
//                                                 className="mr-2"
//                                             />
//                                             <span className="text-sm">{rate.label}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Clear Filters */}
//                             <Button
//                                 variant="secondary"
//                                 size="sm"
//                                 className="w-full"
//                                 onClick={() => setFilters({ category: 'all', priceRange: 'all', rating: 0, search: '' })}
//                             >
//                                 Clear All Filters
//                             </Button>
//                         </Card>
//                     </aside>

//                     {/* Main Content - Courses */}
//                     <div className="lg:col-span-3">
//                         {/* Sort Bar */}
//                         <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//                             <p className="text-gray-600 font-medium">
//                                 Found {filteredCourses.length} courses
//                             </p>
//                             <select
//                                 value={sortBy}
//                                 onChange={(e) => setSortBy(e.target.value)}
//                                 className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                                 <option value="popular">Most Popular</option>
//                                 <option value="newest">Newest</option>
//                                 <option value="rating">Highest Rated</option>
//                                 <option value="price-low">Price: Low to High</option>
//                                 <option value="price-high">Price: High to Low</option>
//                             </select>
//                         </div>

//                         {/* Courses Grid */}
//                         {filteredCourses.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {filteredCourses.map(course => (
//                                     <Link to={`/pdf/${course._id}`} key={course._id}>
//                                         <Card hoverable className="h-full hover:shadow-xl transition-all">
//                                             <div className="mb-4">
//                                                 <div className="text-6xl mb-3 text-center">{course.image}</div>
//                                                 <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
//                                                     <Badge variant="primary">{course.subcategory}</Badge>
//                                                     <span className="text-yellow-500 font-semibold">★ {course.rating}</span>
//                                                 </div>
//                                             </div>
//                                             <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
//                                             <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

//                                             <div className="mb-4">
//                                                 <div className="flex flex-wrap gap-1 mb-2">
//                                                     {course.features.slice(0, 2).map((feature, idx) => (
//                                                         <Badge key={idx} variant="gray" size="sm">{feature}</Badge>
//                                                     ))}
//                                                     {course.features.length > 2 && (
//                                                         <Badge variant="gray" size="sm">+{course.features.length - 2} more</Badge>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             <div className="flex justify-between items-center mb-3">
//                                                 <span className="font-bold text-blue-600 text-2xl">₹{course.price}</span>
//                                                 <span className="text-gray-500 text-sm">{course.students.toLocaleString()} students</span>
//                                             </div>

//                                             <div className="pt-3 border-t text-xs text-gray-500">
//                                                 <p>By {course.author} • {course.pages} pages</p>
//                                                 <p>{course.downloads.toLocaleString()} downloads</p>
//                                             </div>
//                                         </Card>
//                                     </Link>
//                                 ))}
//                             </div>
//                         ) : (
//                             <Card className="text-center py-12">
//                                 <div className="text-5xl mb-4">🔍</div>
//                                 <p className="text-gray-600 text-lg mb-4">No courses found matching your criteria</p>
//                                 <Button
//                                     variant="primary"
//                                     onClick={() => setFilters({ category: 'all', priceRange: 'all', rating: 0, search: '' })}
//                                 >
//                                     Clear Filters
//                                 </Button>
//                             </Card>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/apiService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';
import { hideBrokenImage, resolveCoverImageUrl } from '../utils/media';

const hasPublicCourseDetails = (course) =>
    Boolean(
        course &&
        course.title &&
        String(course.title).trim() &&
        course.description &&
        String(course.description).trim() &&
        course.pdfUrl &&
        (course.price || course.price === 0)
    );

export default function Explore() {
    const { theme, appUser } = useContext(AppContext);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        search: ''
    });

    const [sortBy, setSortBy] = useState('newest');

    /* ==========================
       FETCH COURSES
    ========================== */

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const params =
                    appUser?.role === "admin" && appUser?._id
                        ? { instructor: appUser._id }
                        : {};
                const res = await courseAPI.getAllCourses(params);

                if (res.success) {
                    setCourses((res.data || []).filter(hasPublicCourseDetails));
                } else {
                    setError("Failed to fetch courses");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [appUser?._id, appUser?.role]);

    /* ==========================
       FILTER + SORT
    ========================== */

    const filteredCourses = useMemo(() => {
        let result = courses.filter(course => {
            if (
                filters.search &&
                !course.title.toLowerCase().includes(filters.search.toLowerCase())
            ) {
                return false;
            }
            return true;
        });

        if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            result.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        return result;
    }, [courses, filters, sortBy]);

    if (loading) {
        return <div className="p-10 text-center">Loading courses...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-500">{error}</div>;
    }

    return (
        <div className={`min-h-screen py-10 ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <div className="container mx-auto px-4">

                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                        <input
                        type="text"
                        placeholder="Search courses..."
                        value={filters.search}
                        onChange={(e) =>
                            setFilters({ ...filters, search: e.target.value })
                        }
                            className={`border rounded px-4 py-2 w-64 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                        />

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`border rounded px-4 py-2 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low → High</option>
                        <option value="price-high">Price: High → Low</option>
                    </select>
                </div>

                {filteredCourses.length === 0 ? (
                    <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        No courses found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <Link to={`/pdf/${course._id}`} key={course._id}>
                                <Card hoverable>

                                    {resolveCoverImageUrl(course.coverUrl) && (
                                        <img
                                            src={resolveCoverImageUrl(course.coverUrl)}
                                            alt={course.title}
                                            className="w-full h-48 object-cover rounded mb-4"
                                            onError={hideBrokenImage}
                                        />
                                    )}

                                    <h3 className="font-bold text-lg mb-2">
                                        {course.title}
                                    </h3>

                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2`}>
                                        {course.description}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-blue-600 text-xl">
                                            ₹{course.price}
                                        </span>
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {(course.students || 0).toLocaleString()} students
                                        </span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
