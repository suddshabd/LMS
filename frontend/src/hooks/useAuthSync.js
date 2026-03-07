import { useEffect } from 'react';

export default function useAuthSync() {
    useEffect(() => {
        // Check if user is logged in from localStorage
        const user = localStorage.getItem('user');
        if (user) {
            // Verify token validity with backend
            console.log('User authenticated:', JSON.parse(user));
        }
    }, []);
}
