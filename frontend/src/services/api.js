const API_BASE_URL = import.meta.env.VITE_API_URL

const api = {
    // GET request
    get: async (endpoint, options = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    },

    // POST request
    post: async (endpoint, body = {}, options = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(body),
            ...options
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    },

    // PUT request
    put: async (endpoint, body = {}, options = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(body),
            ...options
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    },

    // DELETE request
    delete: async (endpoint, options = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    }
};

export default api;
