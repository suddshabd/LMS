import React, { useState, useContext, useEffect } from 'react';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { courseAPI } from '../../services/apiService';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { AppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { getCoursePricing } from '../../utils/pricing';

const getFileSizeInMB = (sizeInBytes) => {
    return (sizeInBytes / (1024 * 1024)).toFixed(2);
};

export default function UploadForm() {
    const { courseId: routeCourseId } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const queryEditCourseId = searchParams.get('edit');
    const stateEditCourseId = location.state?.editCourseId;
    const stateCourseData = location.state?.courseData;
    const editCourseId = routeCourseId || queryEditCourseId || stateEditCourseId || null;
    const isEditMode = Boolean(editCourseId || stateCourseData);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Banking',
        subcategory: '',
        price: '',
        discount: '0',
        description: '',
        pages: '',
        features: '',
        pdf: null,
        cover: null
    });

    const [coverPreview, setCoverPreview] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [loadingExistingCourse, setLoadingExistingCourse] = useState(false);
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const { theme } = useContext(AppContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const categories = ['Banking', 'SSC', 'Government', 'General'];
    const subcategories = {
        Banking: ['SBI PO', 'IBPS', 'RBI', 'Insurance'],
        SSC: ['CGL', 'CHSL', 'CPF', 'MTS'],
        Government: ['UPSC', 'Railway', 'State PSC', 'Other'],
        General: ['Aptitude', 'English', 'Reasoning', 'GK']
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const livePricing = getCoursePricing({
        price: formData.price,
        discount: formData.discount,
    });
    useEffect(() => {
        return () => {
            if (pdfPreview) URL.revokeObjectURL(pdfPreview);
        };
    }, [pdfPreview]);

    useEffect(() => {
        const fetchExistingCourse = async () => {
            if (!isEditMode) return;

            if (stateCourseData) {
                setFormData((prev) => ({
                    ...prev,
                    title: stateCourseData.title || '',
                    category: stateCourseData.category || 'Banking',
                    subcategory: stateCourseData.subcategory || '',
                    price: String(stateCourseData.price ?? ''),
                    discount: String(stateCourseData.discount ?? 0),
                    description: stateCourseData.description || '',
                    pages: String(stateCourseData.pages ?? ''),
                    features: Array.isArray(stateCourseData.features) ? stateCourseData.features.join(', ') : '',
                    pdf: null,
                    cover: null,
                }));
                setCoverPreview(stateCourseData.coverUrl || null);
                setPdfPreview(null);
            }

            if (!editCourseId) return;

            try {
                setLoadingExistingCourse(true);
                const response = await courseAPI.getCourseById(editCourseId);

                if (!response?.success || !response?.data) {
                    throw new Error('Course not found');
                }

                const course = response.data;
                setFormData((prev) => ({
                    ...prev,
                    title: course.title || '',
                    category: course.category || 'Banking',
                    subcategory: course.subcategory || '',
                    price: String(course.price ?? ''),
                    discount: String(course.discount ?? 0),
                    description: course.description || '',
                    pages: String(course.pages ?? ''),
                    features: Array.isArray(course.features) ? course.features.join(', ') : '',
                    pdf: null,
                    cover: null,
                }));
                setCoverPreview(course.coverUrl || null);
                setPdfPreview(null);
            } catch (error) {
                setMessage(`❌ ${error.message}`);
            } finally {
                setLoadingExistingCourse(false);
            }
        };

        fetchExistingCourse();
    }, [isEditMode, editCourseId, stateCourseData]);

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (files && files[0]) {
            const file = files[0];

            if (name === 'cover') {
                const reader = new FileReader();
                reader.onload = (event) => setCoverPreview(event.target.result);
                reader.readAsDataURL(file);
            }

            if (name === 'pdf') {
                if (pdfPreview) URL.revokeObjectURL(pdfPreview);
                setPdfPreview(URL.createObjectURL(file));
            }

            setFormData(prev => ({ ...prev, [name]: file }));
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setMessage('');



    //     console.log("clerkUser:", clerkUser);
    //     console.log("formData:", formData);



    //     try {
    //         if (!formData.title || !formData.price || !formData.pdf || !formData.cover) {
    //             throw new Error('Please fill all required fields');
    //         }

    //         // 🔹 Sync user
    //         const email = clerkUser?.emailAddresses?.[0]?.emailAddress || '';

    //         if (!formData.title || !formData.price || !formData.pdf || !formData.cover) {
    //             throw new Error('Please fill all required fields');
    //         }

    //         await courseAPI.createCourse(formPayload);

    //         // 🔹 Upload files
    //         setMessage('📤 Uploading files...');
    //         const uploadResponse = await courseAPI.uploadFiles(
    //             formData.pdf,
    //             formData.cover
    //         );

    //         if (!uploadResponse.success) {
    //             throw new Error('File upload failed');
    //         }

    //         const { pdf, cover } = uploadResponse.data;

    //         // 🔹 Create course
    //         setMessage('💾 Creating course...');

    //         const courseData = {
    //             title: formData.title,
    //             category: formData.category,
    //             subcategory: formData.subcategory,
    //             price: parseInt(formData.price),
    //             description: formData.description,
    //             pages: parseInt(formData.pages) || 0,
    //             features: formData.features
    //                 .split(',')
    //                 .map(f => f.trim())
    //                 .filter(Boolean),
    //             author: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || 'Admin',
    //             authorId: clerkUser?.id,
    //             pdfUrl: pdf.url,
    //             coverUrl: cover.url,
    //             rating: 4.5,
    //             reviews: 0,
    //             students: 0,
    //             downloads: 0
    //         };

    //         const createResponse = await courseAPI.createCourse(courseData);

    //         if (!createResponse.success) {
    //             throw new Error('Course creation failed');
    //         }

    //         setMessage('✅ Course uploaded successfully!');

    //         // Reset form
    //         setFormData({
    //             title: '',
    //             category: 'Banking',
    //             subcategory: '',
    //             price: '',
    //             description: '',
    //             pages: '',
    //             features: '',
    //             pdf: null,
    //             cover: null
    //         });

    //         setPreview(null);

    //         setTimeout(() => navigate('/admin'), 2000);

    //     } catch (error) {
    //         setMessage(`❌ ${error.message}`);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isEditMode) {
                if (!formData.title || !formData.price) {
                    throw new Error("Please fill title and price");
                }

                const token = await getToken();
                const payload = {
                    title: formData.title,
                    category: formData.category,
                    subcategory: formData.subcategory,
                    price: Number(formData.price),
                    discount: Number(formData.discount || 0),
                    description: formData.description,
                    pages: Number(formData.pages) || 0,
                    features: formData.features
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                };

                const response = await courseAPI.updateCourse(editCourseId, payload, token);

                if (!response.success) {
                    throw new Error(response.message || "Course update failed");
                }

                setMessage("✅ Course updated successfully!");
                showToast("Course updated successfully", "success");
                setTimeout(() => navigate("/admin"), 1200);
                return;
            }

            if (!formData.title || !formData.price || !formData.pdf || !formData.cover) {
                throw new Error("Please fill all required fields");
            }

            const formPayload = new FormData();

            formPayload.append("title", formData.title);
            formPayload.append("category", formData.category);
            formPayload.append("subcategory", formData.subcategory);
            formPayload.append("price", formData.price);
            formPayload.append("discount", formData.discount || 0);
            formPayload.append("description", formData.description);
            formPayload.append("pages", formData.pages);
            formPayload.append("features", formData.features);

            formPayload.append("pdf", formData.pdf);
            formPayload.append("cover", formData.cover);

            const response = await courseAPI.createCourse(formPayload);

            if (!response.success) {
                throw new Error("Course creation failed");
            }

            setMessage("✅ Course uploaded successfully!");
            showToast("Course uploaded successfully", "success");

            setFormData({
                title: '',
                category: 'Banking',
                subcategory: '',
                price: '',
                discount: '0',
                description: '',
                pages: '',
                features: '',
                pdf: null,
                cover: null
            });
            setCoverPreview(null);
            if (pdfPreview) URL.revokeObjectURL(pdfPreview);
            setPdfPreview(null);

            setTimeout(() => navigate("/admin"), 1500);

        } catch (error) {
            setMessage(`❌ ${error.message}`);
            showToast(error.message || "Operation failed", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-slate-100 text-slate-900'} py-12 px-4`}>
                <div className="mx-auto max-w-5xl animate-pulse">
                    <div className={`h-24 rounded-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} />
                </div>
            </div>
        );
    }

    if (loadingExistingCourse) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-slate-100 text-slate-900'} py-12 px-4`}>
                <div className="mx-auto max-w-5xl animate-pulse">
                    <div className={`h-24 rounded-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} />
                </div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-slate-100 text-slate-900'} py-12 px-4`}>
                <div className="mx-auto max-w-2xl">
                    <Card className={`${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-slate-200'}`}>
                        <h2 className="text-xl font-semibold mb-2">Sign in required</h2>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Please sign in to upload courses.</p>
                    </Card>
                </div>
            </div>
        );
    }

    const inputClass = `w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none ${theme === 'dark'
        ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30'
        : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
        }`;

    return (
        <div className={`min-h-screen py-12 ${theme === 'dark'
            ? 'bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#030712_50%,_#000_100%)]'
            : 'bg-[radial-gradient(circle_at_top,_#ecfeff_0%,_#f8fafc_45%,_#e2e8f0_100%)]'
            }`}>
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
                    <Card className={`xl:col-span-3 border shadow-xl ${theme === 'dark'
                        ? 'bg-gray-950/85 border-cyan-900/40 backdrop-blur-sm'
                        : 'bg-white/90 border-cyan-100 backdrop-blur-sm'
                        }`}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">
                                    {isEditMode ? 'Edit Course' : 'Upload New Course'}
                                </h1>
                                <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                    {isEditMode
                                        ? 'Update details and save changes.'
                                        : 'Add details, upload files, and publish in one flow.'}
                                </p>
                            </div>
                            <div className="hidden sm:block h-12 w-12 rounded-full overflow-hidden border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
                                {user?.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt={user?.fullName || 'User avatar'}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-cyan-500/20 text-cyan-300 font-semibold">
                                        {(user?.firstName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {message && (
                            <div className={`mb-6 p-4 rounded-xl border ${message.includes('✅')
                                ? 'bg-emerald-100/80 border-emerald-300 text-emerald-800'
                                : 'bg-rose-100/80 border-rose-300 text-rose-800'
                                }`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Course Title"
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                        required
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Subcategory</label>
                                    <select
                                        name="subcategory"
                                        value={formData.subcategory}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                    >
                                        <option value="">Select subcategory</option>
                                        {subcategories[formData.category]?.map(sub => (
                                            <option key={sub} value={sub}>
                                                {sub}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Price (INR)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="499"
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Discount (%)</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        min="0"
                                        max="100"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        placeholder="10"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Pages</label>
                                    <input
                                        type="number"
                                        name="pages"
                                        value={formData.pages}
                                        onChange={handleInputChange}
                                        placeholder="120"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Write what learners will get from this PDF..."
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
                                <input
                                    type="text"
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    placeholder="Practice sets, Answer keys, Quick revision notes"
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`rounded-xl border p-4 transition-all duration-300 ${theme === 'dark' ? 'border-gray-700 bg-gray-900/70' : 'border-slate-200 bg-slate-50/80'}`}>
                                    <label className="block text-sm font-medium mb-2">Cover Image</label>
                                    <input
                                        type="file"
                                        name="cover"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-2 file:font-medium file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                                        required={!isEditMode}
                                    />
                                    {coverPreview && (
                                        <img
                                            src={coverPreview}
                                            alt="Cover Preview"
                                            className="mt-4 h-44 w-full rounded-lg object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
                                        />
                                    )}
                                </div>

                                <div className={`rounded-xl border p-4 transition-all duration-300 ${theme === 'dark' ? 'border-gray-700 bg-gray-900/70' : 'border-slate-200 bg-slate-50/80'}`}>
                                    <label className="block text-sm font-medium mb-2">PDF File</label>
                                    <input
                                        type="file"
                                        name="pdf"
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-2 file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                                        required={!isEditMode}
                                    />

                                    {formData.pdf && (
                                        <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-slate-700'}`}>
                                            <p className="truncate font-medium">{formData.pdf.name}</p>
                                            <p>{getFileSizeInMB(formData.pdf.size)} MB</p>
                                        </div>
                                    )}

                                    {pdfPreview && (
                                        <iframe
                                            title="PDF Preview"
                                            src={pdfPreview}
                                            className="mt-4 h-44 w-full rounded-lg border border-slate-300/40 bg-white"
                                        />
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                className="w-full py-3 text-base font-semibold shadow-lg shadow-cyan-500/20 hover:scale-[1.01] transition-transform duration-300"
                            >
                                {isEditMode ? 'Save Changes' : 'Upload Course'}
                            </Button>
                        </form>
                    </Card>

                    <Card className={`xl:col-span-2 border sticky top-24 ${theme === 'dark'
                        ? 'bg-gray-950/85 border-cyan-900/40 backdrop-blur-sm'
                        : 'bg-white/90 border-cyan-100 backdrop-blur-sm'
                        }`}>
                        <h3 className="text-xl font-bold mb-4">Live Preview</h3>
                        <div className={`rounded-2xl p-5 border transition-all duration-500 ${theme === 'dark'
                            ? 'bg-gray-900 border-gray-700'
                            : 'bg-slate-50 border-slate-200'
                            }`}>
                            <p className={`text-xs uppercase tracking-wide mb-2 ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                {formData.category || 'Category'}
                            </p>
                            <h4 className="text-2xl font-extrabold mb-2 line-clamp-2">
                                {formData.title || 'Your course title appears here'}
                            </h4>
                            <p className={`text-sm mb-4 line-clamp-4 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                {formData.description || 'Add a strong description so students quickly understand value and outcomes.'}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-end gap-2">
                                    <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                        ₹{livePricing.finalPrice}
                                    </span>
                                    {livePricing.hasDiscount && (
                                        <span className={`text-sm line-through ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                            ₹{livePricing.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                    {formData.pages ? `${formData.pages} pages` : 'Pages not set'}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
