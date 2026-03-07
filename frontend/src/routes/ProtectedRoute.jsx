// frontend/src/routes/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loader from '../components/ui/Loader'; // Assuming this component exists

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, appUser, loadingAppUser } = useContext(AppContext);

    if (loadingAppUser) {
        // Show a loading spinner while user data (including role) is being fetched
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Not authenticated, redirect to home or login
        return <Navigate to="/" replace />;
    }

    if (adminOnly && (!appUser || appUser.role !== 'admin')) {
        // Authenticated but not an admin, redirect to dashboard or a forbidden page
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
