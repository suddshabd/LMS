import React from 'react';
import Modal from '../ui/Modal';

export default function PdfPreview({ isOpen, onClose, pdf }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={pdf?.title || 'PDF Preview'} size="lg">
            <div className="space-y-4">
                <div className="bg-gray-100 h-96 flex items-center justify-center rounded">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <p className="text-gray-600">PDF Preview</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg">{pdf?.title}</h3>
                    <p className="text-gray-600 mt-2">{pdf?.description}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-semibold text-blue-600 text-xl">${pdf?.price}</span>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        Download
                    </button>
                </div>
            </div>
        </Modal>
    );
}
