import React from 'react';

export default function PdfViewer() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
            <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-bold mb-2">PDF Viewer</h3>
                <p className="text-gray-600">PDF rendering functionality</p>
            </div>
        </div>
    );
}
