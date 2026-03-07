import React, { useContext } from 'react';
import CreatorStats from '../components/dashboard/CreatorStats';
import UploadForm from '../components/dashboard/UploadForm';
import Card from '../components/ui/Card';
import { AppContext } from '../context/AppContext';

export default function CreatorPanel() {
    const { theme } = useContext(AppContext);
    const myPdfs = [];

    return (
        <div className={`container mx-auto py-12 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            <h1 className="text-4xl font-bold mb-8">Creator Panel</h1>

            {/* Stats */}
            <div className="mb-8">
                <CreatorStats />
            </div>

            {/* Upload Form and My PDFs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UploadForm />

                <Card>
                    <h3 className="font-bold text-lg mb-4">My PDFs</h3>
                    {myPdfs.length === 0 ? (
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            No uploaded PDFs yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {myPdfs.map(pdf => (
                                <div key={pdf.id} className="border-b pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold">{pdf.title}</h4>
                                        <span className="text-green-600 font-bold">{pdf.revenue}</span>
                                    </div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{pdf.sales} sales</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
