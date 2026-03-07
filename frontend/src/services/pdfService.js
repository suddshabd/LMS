import api from './api';

const pdfService = {
    // Get all PDFs
    getAllPdfs: async (filters = {}) => {
        return api.get('/pdfs', { params: new URLSearchParams(filters).toString() });
    },

    // Get single PDF
    getPdfById: async (id) => {
        return api.get(`/pdfs/${id}`);
    },

    // Search PDFs
    searchPdfs: async (query) => {
        return api.get(`/pdfs/search?q=${query}`);
    },

    // Upload new PDF
    uploadPdf: async (formData) => {
        return api.post('/pdfs/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Update PDF
    updatePdf: async (id, data) => {
        return api.put(`/pdfs/${id}`, data);
    },

    // Delete PDF
    deletePdf: async (id) => {
        return api.delete(`/pdfs/${id}`);
    },

    // Get user's PDFs
    getUserPdfs: async (userId) => {
        return api.get(`/users/${userId}/pdfs`);
    },

    // Download PDF
    downloadPdf: async (id) => {
        return api.get(`/pdfs/${id}/download`);
    }
};

export default pdfService;
