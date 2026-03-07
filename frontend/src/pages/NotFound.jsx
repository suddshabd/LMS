import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';

export default function NotFound() {
    const navigate = useNavigate();
    const { theme } = useContext(AppContext);

    return (
        <div className="container mx-auto py-24 text-center">
            <div className={`text-8xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>404</div>
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Sorry, the page you're looking for doesn't exist.</p>
            <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/')}
            >
                Go Back Home
            </Button>
        </div>
    );
}
