// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
// import Card from '../components/ui/Card';
// import Badge from '../components/ui/Badge';
// import Button from '../components/ui/Button';
// import Modal from '../components/ui/Modal';
// import PdfViewer from '../components/pdf/PdfViewer';

// export default function PdfDetails() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { user } = useUser();
//     const [showPreview, setShowPreview] = useState(false);
//     const [isPurchased, setIsPurchased] = useState(false);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);

//     // Find course by ID
//     const course = courseData.find(c => c.id === parseInt(id));

//     if (!course) {
//         return (
//             <div className="container mx-auto py-12 text-center">
//                 <div className="text-6xl mb-4">404</div>
//                 <p className="text-xl text-gray-600 mb-6">Course not found</p>
//                 <Button variant="primary" onClick={() => navigate('/explore')}>
//                     Back to Courses
//                 </Button>
//             </div>
//         );
//     }

//     const handlePurchase = () => {
//         if (!user) {
//             navigate('/');
//             return;
//         }
//         setShowPaymentModal(true);
//     };

//     const completePayment = () => {
//         setIsPurchased(true);
//         setShowPaymentModal(false);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Breadcrumb */}
//             <div className="bg-white border-b">
//                 <div className="container mx-auto px-4 py-4">
//                     <button onClick={() => navigate('/explore')} className="text-blue-600 hover:underline">
//                         ← Back to Courses
//                     </button>
//                 </div>
//             </div>

//             <div className="container mx-auto px-4 py-12">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Main Content */}
//                     <div className="lg:col-span-2">
//                         {/* Course Header */}
//                         <div className="mb-8">
//                             <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
//                                 <div>
//                                     <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
//                                     <div className="flex items-center gap-4 flex-wrap">
//                                         <div className="flex items-center gap-1">
//                                             <span className="text-yellow-500 text-lg">★ {course.rating}</span>
//                                             <span className="text-gray-600">({course.reviews.toLocaleString()} reviews)</span>
//                                         </div>
//                                         <Badge variant="primary">{course.category}</Badge>
//                                         <span className="text-gray-600">{course.students.toLocaleString()} students</span>
//                                     </div>
//                                 </div>
//                                 <div className="text-6xl">{course.image}</div>
//                             </div>
//                         </div>

//                         {/* Author Info */}
//                         <Card className="mb-8">
//                             <div className="flex items-center gap-4">
//                                 <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
//                                     {course.author.charAt(0)}
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600">Course Author</p>
//                                     <p className="font-bold text-lg">{course.author}</p>
//                                     <p className="text-sm text-gray-500">Expert Educator • {course.downloads.toLocaleString()}+ downloads</p>
//                                 </div>
//                             </div>
//                         </Card>

//                         {/* Course Preview */}
//                         {isPurchased ? (
//                             <div className="mb-8">
//                                 <h3 className="font-bold text-xl mb-4">Course Content Preview</h3>
//                                 <div className="h-96 rounded-lg overflow-hidden">
//                                     <PdfViewer />
//                                 </div>
//                             </div>
//                         ) : (
//                             <Card className="mb-8 bg-linear-to-br from-blue-50 to-indigo-50">
//                                 <div className="text-center py-16">
//                                     <div className="text-6xl mb-4">🔒</div>
//                                     <p className="text-gray-700 mb-4 font-semibold">This content is locked</p>
//                                     <p className="text-gray-600 mb-6">Purchase this course to access the complete material</p>
//                                     <SignedOut>
//                                         <p className="text-blue-600 text-sm">Sign in to purchase</p>
//                                     </SignedOut>
//                                 </div>
//                             </Card>
//                         )}

//                         {/* Course Description */}
//                         <Card className="mb-8">
//                             <h3 className="font-bold text-xl mb-4">About This Course</h3>
//                             <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>

//                             <div className="grid grid-cols-2 gap-6 mb-6">
//                                 <div>
//                                     <p className="text-gray-600 text-sm mb-1">Total Pages</p>
//                                     <p className="text-2xl font-bold text-blue-600">{course.pages}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-gray-600 text-sm mb-1">Total Downloads</p>
//                                     <p className="text-2xl font-bold text-blue-600">{course.downloads.toLocaleString()}</p>
//                                 </div>
//                             </div>
//                         </Card>

//                         {/* Features */}
//                         <Card>
//                             <h3 className="font-bold text-xl mb-4">What You'll Get</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {course.features.map((feature, idx) => (
//                                     <div key={idx} className="flex items-start gap-3">
//                                         <span className="text-green-500 text-xl mt-0.5">✓</span>
//                                         <span className="text-gray-700">{feature}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </Card>
//                     </div>

//                     {/* Sidebar */}
//                     <aside>
//                         <Card className="sticky top-24">
//                             {/* Price */}
//                             <div className="mb-6">
//                                 <p className="text-gray-600 text-sm mb-2">Course Price</p>
//                                 <p className="text-5xl font-bold text-blue-600 mb-2">₹{course.price}</p>
//                                 <p className="text-sm text-gray-500 mb-4">One-time payment, lifetime access</p>
//                             </div>

//                             {/* Purchase Button */}
//                             {!isPurchased ? (
//                                 <>
//                                     <SignedIn>
//                                         <Button
//                                             variant="primary"
//                                             size="lg"
//                                             className="w-full mb-3"
//                                             onClick={handlePurchase}
//                                         >
//                                             Buy Course Now
//                                         </Button>
//                                     </SignedIn>
//                                     <SignedOut>
//                                         <Button
//                                             variant="primary"
//                                             size="lg"
//                                             className="w-full mb-3"
//                                             onClick={() => navigate('/')}
//                                         >
//                                             Sign In to Buy
//                                         </Button>
//                                     </SignedOut>

//                                     <Button
//                                         variant="secondary"
//                                         size="lg"
//                                         className="w-full mb-4"
//                                         onClick={() => setShowPreview(true)}
//                                     >
//                                         Preview Course
//                                     </Button>
//                                 </>
//                             ) : (
//                                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
//                                     <p className="text-green-700 font-semibold text-center">✓ Course Purchased</p>
//                                 </div>
//                             )}

//                             {/* Course Stats */}
//                             <div className="border-t pt-6 space-y-4">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-gray-600">Rating</span>
//                                     <span className="font-bold">⭐ {course.rating}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-gray-600">Reviews</span>
//                                     <span className="font-bold">{course.reviews.toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-gray-600">Students</span>
//                                     <span className="font-bold">{course.students.toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-gray-600">Last Updated</span>
//                                     <span className="font-bold">2025</span>
//                                 </div>
//                             </div>

//                             {/* Money Back Guarantee */}
//                             <Card className="mt-6 bg-blue-50 border-blue-200">
//                                 <div className="text-center">
//                                     <p className="text-2xl mb-2">🛡️</p>
//                                     <p className="text-sm text-gray-700">
//                                         <span className="font-bold">30-day</span> money-back guarantee
//                                     </p>
//                                 </div>
//                             </Card>
//                         </Card>
//                     </aside>
//                 </div>
//             </div>

//             {/* Payment Modal */}
//             <Modal
//                 isOpen={showPaymentModal}
//                 onClose={() => setShowPaymentModal(false)}
//                 title="Complete Your Purchase"
//                 size="md"
//             >
//                 <div className="space-y-4">
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <div className="flex justify-between mb-2">
//                             <span>{course.title}</span>
//                             <span className="font-bold">₹{course.price}</span>
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium mb-2">Payment Method</label>
//                         <select className="w-full border rounded px-3 py-2">
//                             <option>Credit/Debit Card</option>
//                             <option>UPI</option>
//                             <option>Net Banking</option>
//                             <option>Wallet</option>
//                         </select>
//                     </div>

//                     <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
//                         💳 This is a demo. Payment won't be charged.
//                     </div>

//                     <div className="flex gap-3">
//                         <Button
//                             variant="secondary"
//                             className="flex-1"
//                             onClick={() => setShowPaymentModal(false)}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             variant="primary"
//                             className="flex-1"
//                             onClick={completePayment}
//                         >
//                             Complete Payment
//                         </Button>
//                     </div>
//                 </div>
//             </Modal>

//             {/* Preview Modal */}
//             <Modal
//                 isOpen={showPreview}
//                 onClose={() => setShowPreview(false)}
//                 title={`${course.title} - Preview`}
//                 size="lg"
//             >
//                 <div className="space-y-4">
//                     <div className="bg-gray-100 rounded-lg p-4">
//                         <p className="text-gray-600 text-center mb-4">First 10% Preview</p>
//                         <div className="h-64">
//                             <PdfViewer />
//                         </div>
//                     </div>
//                     <p className="text-sm text-gray-600 text-center">
//                         Sign in and purchase to access the full course material
//                     </p>
//                     <div className="flex gap-3">
//                         <Button
//                             variant="secondary"
//                             className="flex-1"
//                             onClick={() => setShowPreview(false)}
//                         >
//                             Close Preview
//                         </Button>
//                         {!isPurchased && (
//                             <SignedIn>
//                                 <Button
//                                     variant="primary"
//                                     className="flex-1"
//                                     onClick={() => {
//                                         setShowPreview(false);
//                                         handlePurchase();
//                                     }}
//                                 >
//                                     Buy Now
//                                 </Button>
//                             </SignedIn>
//                         )}
//                     </div>
//                 </div>
//             </Modal>
//         </div>
//     );
// }

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { courseAPI } from '../services/apiService';
import { paymentAPI } from '../services/apiService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { AppContext } from '../context/AppContext';
import CashfreePayment from '../components/payment/CashfreePayment';

const getSafePdfUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    if (!url.includes("/res.cloudinary.com/")) return url;
    const lowerUrl = url.toLowerCase();
    const looksLikePdfAsset =
        lowerUrl.includes(".pdf") || lowerUrl.includes("/pib-bits/pdfs/");
    if (!looksLikePdfAsset) return url;
    return url.replace("/image/upload/", "/raw/upload/");
};

export default function PdfDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { theme } = useContext(AppContext);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPurchased, setIsPurchased] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    /* ==========================
       FETCH COURSE FROM BACKEND
    ========================== */

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await courseAPI.getCourseById(id);
                if (res.success) {
                    setCourse(res.data);
                }
            } catch (err) {
                console.error("Course fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    useEffect(() => {
        const checkPurchaseStatus = async () => {
            if (!user || !id) return;
            try {
                const res = await paymentAPI.getMyPayments();
                if (!res.success) return;
                const hasPurchased = (res.data || []).some(
                    (payment) =>
                        payment.status === "captured" &&
                        String(payment.course?._id || payment.course) === String(id)
                );
                setIsPurchased(hasPurchased);
            } catch (err) {
                console.error("Payment status check error:", err);
            }
        };

        checkPurchaseStatus();
    }, [user, id]);

    if (loading) {
        return <div className="p-10 text-center">Loading course...</div>;
    }

    if (!course) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
                <Button onClick={() => navigate('/explore')}>
                    Back to Explore
                </Button>
            </div>
        );
    }

    const handlePurchase = () => {
        if (!user) {
            navigate('/');
            return;
        }
        setShowPaymentModal(true);
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>

            {/* Back */}
            <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate('/explore')}
                        className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                    >
                        ← Back to Courses
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT SIDE */}
                <div className="lg:col-span-2">

                    {/* Cover Image */}
                    {course.coverUrl && (
                        <img
                            src={course.coverUrl}
                            alt={course.title}
                            className="w-full h-72 object-cover rounded mb-6"
                        />
                    )}

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-4">
                        {course.title}
                    </h1>

                    <div className="flex gap-4 mb-6 flex-wrap">
                        <Badge>{course.category}</Badge>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {(course.students || 0).toLocaleString()} students
                        </span>
                        <span className="text-yellow-500">
                            ★ {course.rating || 4.5}
                        </span>
                    </div>

                    {/* Description */}
                    <Card className="mb-6">
                        <h3 className="font-bold text-xl mb-4">
                            About This Course
                        </h3>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {course.description}
                        </p>
                    </Card>

                    {/* PDF Access */}
                    {isPurchased ? (
                        <Card>
                            <h3 className="font-bold mb-4">Course PDF</h3>
                            <a
                                href={getSafePdfUrl(course.pdfUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block"
                            >
                                <Button variant="primary" className="px-5 py-2.5">
                                    View PDF
                                </Button>
                            </a>
                        </Card>
                    ) : (
                        <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-blue-50'} text-center py-12`}>
                            <p className="mb-4 font-semibold">
                                Purchase this course to unlock full PDF access
                            </p>
                        </Card>
                    )}
                </div>

                {/* RIGHT SIDE */}
                <aside>
                    <Card className="sticky top-24">

                        <p className={theme === 'dark' ? 'text-gray-400 text-sm mb-2' : 'text-gray-600 text-sm mb-2'}>
                            Course Price
                        </p>

                        <p className="text-4xl font-bold text-blue-600 mb-4">
                            ₹{course.price}
                        </p>

                        {!isPurchased ? (
                            <>
                                <SignedIn>
                                    <Button
                                        className="w-full mb-3"
                                        onClick={handlePurchase}
                                    >
                                        Buy Now
                                    </Button>
                                </SignedIn>

                                <SignedOut>
                                    <Button
                                        className="w-full mb-3"
                                        onClick={() => navigate('/')}
                                    >
                                        Sign In to Buy
                                    </Button>
                                </SignedOut>
                            </>
                        ) : (
                            <div className="bg-green-100 p-3 rounded text-green-700 text-center">
                                ✓ Course Purchased
                            </div>
                        )}
                    </Card>
                </aside>
            </div>

            {/* Payment Modal */}
            <Modal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                title="Complete Payment"
            >
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>{course.title}</span>
                        <span className="font-bold">₹{course.price}</span>
                    </div>

                    {course && (
                        <CashfreePayment
                            course={course}
                            onSuccess={() => {
                                setIsPurchased(true);
                                setShowPaymentModal(false);
                            }}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
}
