import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { AppContext } from '../../context/AppContext';
import { resolveCoverImageUrl } from '../../utils/media';

export default function PdfCard({ pdf, course }) {
    const { theme } = useContext(AppContext);
    const data = pdf || course;
    const coverSrc = resolveCoverImageUrl(data?.coverUrl || data?.cover);

    return (
        <Link to={`/pdf/${data?._id || data?.id || 1}`}>
            <Card hoverable className={`h-full cursor-pointer hover:shadow-xl transition-all ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="mb-4">
                    {coverSrc ? (
                        <img
                            src={coverSrc}
                            alt={data?.title}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                    ) : (
                        <div className="text-5xl mb-3 text-center">{data?.image || '📄'}</div>
                    )}
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <Badge variant="primary">{data?.category || 'Category'}</Badge>
                        {data?.rating && <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`}>★ {data.rating}</span>}
                    </div>
                </div>
                <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{data?.title || 'PDF Title'}</h3>
                <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{data?.description || 'Description'}</p>

                {data?.features && data.features.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {data.features.slice(0, 2).map((feature, idx) => (
                                <Badge key={idx} variant="gray" size="sm">{feature}</Badge>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-3">
                    <span className={`font-bold text-xl ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>₹{data?.price || '0'}</span>
                    {data?.students && <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{(data.students / 1000).toFixed(1)}K students</span>}
                </div>

                <div className={`pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>By {data?.author || 'Author'}</p>
                </div>
            </Card>
        </Link>
    );
}
