// import React from 'react';
// import { Link } from 'react-router-dom';
// import { SignedOut, SignedIn } from '@clerk/clerk-react';
// import Button from '../components/ui/Button';
// import Card from '../components/ui/Card';
// import Badge from '../components/ui/Badge';

// export default function Home() {
//     const featuredCourses = courseData.slice(0, 6);

//     return (
//         <div className="w-full">
//             {/* Hero Section */}
//             <section className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16 md:py-24">
//                 <div className="container mx-auto px-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//                         <div>
//                             <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
//                                 Master Your Exams with Premium Study Materials
//                             </h1>
//                             <p className="text-lg md:text-xl text-blue-100 mb-8">
//                                 Get access to comprehensive PDFs for Banking, SSC, UPSC, and Railway exams. Study at your pace, excel in your exams.
//                             </p>
//                             <div className="flex flex-col sm:flex-row gap-4">
//                                 <Link to="/explore">
//                                     <Button variant="secondary" size="lg" className="w-full sm:w-auto">
//                                         Explore Courses →
//                                     </Button>
//                                 </Link>
//                                 <SignedOut>
//                                     <Button variant="primary" size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
//                                         Start Learning
//                                     </Button>
//                                 </SignedOut>
//                             </div>
//                         </div>
//                         <div className="hidden md:block">
//                             <div className="text-7xl text-center">📚</div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Stats Section */}
//             <section className="bg-gray-50 py-12">
//                 <div className="container mx-auto px-4">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                         <div className="text-center">
//                             <div className="text-3xl md:text-4xl font-bold text-blue-600">12K+</div>
//                             <p className="text-gray-600 mt-2">Active Students</p>
//                         </div>
//                         <div className="text-center">
//                             <div className="text-3xl md:text-4xl font-bold text-blue-600">250+</div>
//                             <p className="text-gray-600 mt-2">Courses Available</p>
//                         </div>
//                         <div className="text-center">
//                             <div className="text-3xl md:text-4xl font-bold text-blue-600">4.8★</div>
//                             <p className="text-gray-600 mt-2">Average Rating</p>
//                         </div>
//                         <div className="text-center">
//                             <div className="text-3xl md:text-4xl font-bold text-blue-600">95%</div>
//                             <p className="text-gray-600 mt-2">Success Rate</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Featured Courses */}
//             <section className="py-16">
//                 <div className="container mx-auto px-4">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
//                         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//                             Discover our most popular courses picked by thousands of successful students
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {featuredCourses.map(course => (
//                             <Link to={`/pdf/${course._id}`} key={course._id}>
//                                 <Card hoverable className="h-full hover:shadow-xl transition-all">
//                                     <div className="mb-4">
//                                         <div className="text-5xl mb-3 text-center">{course.image}</div>
//                                         <div className="flex justify-between items-start mb-2">
//                                             <Badge variant="primary">{course.category}</Badge>
//                                             <span className="text-yellow-500">★ {course.rating}</span>
//                                         </div>
//                                     </div>
//                                     <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
//                                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
//                                     <div className="flex justify-between items-center mb-3">
//                                         <span className="font-bold text-blue-600 text-xl">₹{course.price}</span>
//                                         <span className="text-gray-500 text-sm">{course.students.toLocaleString()} students</span>
//                                     </div>
//                                     <div className="pt-3 border-t">
//                                         <p className="text-xs text-gray-500">{course.pages} pages • {course.downloads} downloads</p>
//                                     </div>
//                                 </Card>
//                             </Link>
//                         ))}
//                     </div>

//                     <div className="text-center mt-12">
//                         <Link to="/explore">
//                             <Button variant="primary" size="lg">
//                                 View All Courses
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>
//             </section>

//             {/* Categories Section */}
//             <section className="bg-gray-50 py-16">
//                 <div className="container mx-auto px-4">
//                     <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Browse by Category</h2>
//                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//                         {categories.map((cat, idx) => (
//                             <Link to="/explore" key={idx}>
//                                 <Card hoverable className="text-center h-full">
//                                     <div className="text-3xl mb-3">
//                                         {cat.value === 'Banking' ? '🏦' :
//                                             cat.value === 'SSC' ? '📚' :
//                                                 cat.value === 'Government' ? '🏛️' :
//                                                     cat.value === 'General' ? '🎓' : '📖'}
//                                     </div>
//                                     <p className="font-semibold text-gray-700">{cat.name}</p>
//                                 </Card>
//                             </Link>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Features Section */}
//             <section className="py-16">
//                 <div className="container mx-auto px-4">
//                     <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose ExamHub?</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         {[
//                             { icon: '✓', title: 'Comprehensive Content', desc: 'Complete study materials covering all exam topics' },
//                             { icon: '⚡', title: 'Instant Access', desc: 'Download immediately after purchase' },
//                             { icon: '🎯', title: 'Expert Authors', desc: 'Created by experienced educators and toppers' },
//                             { icon: '📱', title: 'Mobile Friendly', desc: 'Access on any device, anytime, anywhere' },
//                             { icon: '🔄', title: 'Regular Updates', desc: 'Content updated with latest exam patterns' },
//                             { icon: '💬', title: 'Lifetime Support', desc: 'Get help whenever you need it' }
//                         ].map((feature, idx) => (
//                             <Card key={idx}>
//                                 <div className="text-4xl mb-3">{feature.icon}</div>
//                                 <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
//                                 <p className="text-gray-600">{feature.desc}</p>
//                             </Card>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Testimonials Section */}
//             <section className="bg-linear-to-r from-blue-50 to-indigo-50 py-16">
//                 <div className="container mx-auto px-4">
//                     <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What Students Say</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         {[
//                             { name: 'Ramesh Kumar', role: 'SBI PO Selected', text: 'ExamHub materials helped me clear SBI PO with great marks. Highly recommended!' },
//                             { name: 'Priya Singh', role: 'SSC CGL Qualified', text: 'Best quality PDFs for SSC exams. The practice questions were very helpful.' },
//                             { name: 'Aditya Patel', role: 'Railway NTPC Passed', text: 'Affordable and comprehensive. Cleared my Railway exam in first attempt!' }
//                         ].map((testimonial, idx) => (
//                             <Card key={idx}>
//                                 <div className="mb-3">
//                                     <span className="text-yellow-500">★ ★ ★ ★ ★</span>
//                                 </div>
//                                 <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
//                                 <div className="border-t pt-3">
//                                     <p className="font-bold text-gray-800">{testimonial.name}</p>
//                                     <p className="text-sm text-blue-600">{testimonial.role}</p>
//                                 </div>
//                             </Card>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* CTA Section */}
//             <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-16">
//                 <div className="container mx-auto px-4 text-center">
//                     <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ace Your Exams?</h2>
//                     <p className="text-lg mb-8 text-blue-100">Join thousands of successful students. Start your journey today!</p>
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                         <Link to="/explore">
//                             <Button variant="secondary" size="lg" className="w-full sm:w-auto">
//                                 Explore All Courses
//                             </Button>
//                         </Link>
//                         <SignedOut>
//                             <Button variant="primary" size="lg" className="w-full sm:w-auto">
//                                 Sign Up Now
//                             </Button>
//                         </SignedOut>
//                     </div>
//                 </div>
//             </section>
//             );
//         </div>
//     );
// }


import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { courseAPI } from '../services/apiService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import { AppContext } from '../context/AppContext';
import { hideBrokenImage, resolveCoverImageUrl } from '../utils/media';
import { getCoursePricing } from '../utils/pricing';

gsap.registerPlugin(ScrollTrigger);

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

export default function Home() {
    const homeRef = useRef(null);
    const { theme, appUser } = useContext(AppContext);
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ctx = gsap.context(() => {
            const heroTl = gsap.timeline();
            heroTl.from(".hero-anim", {
                opacity: 0,
                y: 30,
                duration: 0.75,
                stagger: 0.12,
                ease: "power3.out",
            });

            gsap.to(".hero-orb-a", {
                y: -20,
                x: 16,
                duration: 5.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(".hero-orb-b", {
                y: 18,
                x: -14,
                duration: 6.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.from(".featured-head", {
                opacity: 0,
                y: 20,
                duration: 0.55,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".featured-head",
                    start: "top 85%",
                    once: true,
                },
            });

            gsap.from(".featured-cta", {
                opacity: 0,
                y: 18,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".featured-cta",
                    start: "top 92%",
                    once: true,
                },
            });

            const cards = gsap.utils.toArray(".featured-card");
            cards.forEach((card) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 24,
                    duration: 0.58,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        once: true,
                    },
                });
            });
        }, homeRef);

        return () => ctx.revert();
    }, [featuredCourses.length]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const params =
                    appUser?.role === "admin" && appUser?._id
                        ? { instructor: appUser._id }
                        : {};
                const res = await courseAPI.getAllCourses(params);
                if (res.success) {
                    const cleanCourses = (res.data || []).filter(hasPublicCourseDetails);
                    setFeaturedCourses(cleanCourses.slice(0, 6));
                }
            } catch {
                setFeaturedCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [appUser?._id, appUser?.role]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
                <Loader />
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Loading courses...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full" ref={homeRef}>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
                <div className="hero-orb-a absolute -top-12 -left-10 h-44 w-44 rounded-full bg-cyan-300/20 blur-2xl" />
                <div className="hero-orb-b absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-indigo-300/20 blur-2xl" />
                <div className="container mx-auto px-4 text-center">
                    <h1 className="hero-anim text-4xl md:text-5xl font-bold mb-6">
                        Master Your Exams with Premium Study Materials
                    </h1>
                    <p className="hero-anim text-lg text-blue-100 mb-8">
                        Banking, SSC, UPSC, Railway & more.
                    </p>
                    <Link to="/explore" className="hero-anim inline-block">
                        <Button size="lg">Explore Courses →</Button>
                    </Link>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="featured-head text-3xl font-bold text-center mb-10">
                        Featured Courses
                    </h2>

                    {featuredCourses.length === 0 ? (
                        <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            No courses available.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredCourses.map(course => {
                                const pricing = getCoursePricing(course);
                                return (
                                <Link to={`/pdf/${course._id}`} key={course._id}>
                                    <Card hoverable className="h-full featured-card">

                                        {resolveCoverImageUrl(course.coverUrl) && (
                                            <img
                                                src={resolveCoverImageUrl(course.coverUrl)}
                                                alt={course.title}
                                                loading="lazy"
                                                className="w-full h-48 object-cover rounded mb-4"
                                                onError={hideBrokenImage}
                                            />
                                        )}

                                        <Badge variant="primary">
                                            {course.category}
                                        </Badge>

                                        <h3 className="font-bold text-lg mt-3 mb-2">
                                            {course.title}
                                        </h3>

                                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
                                            {course.description}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-blue-600 text-xl">
                                                    ₹{pricing.finalPrice}
                                                </span>
                                                {pricing.hasDiscount && (
                                                    <>
                                                        <span className={`text-sm line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                                            ₹{pricing.originalPrice}
                                                        </span>
                                                        <span className="text-xs text-green-500 font-semibold">
                                                            {pricing.discount}% OFF
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {(course.students || 0).toLocaleString()} students
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className="featured-cta text-center mt-10">
                        <Link to="/explore">
                            <Button size="lg">View All Courses</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
