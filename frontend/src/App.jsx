import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import Loader from './components/ui/Loader';

const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const PdfDetails = lazy(() => import('./pages/PdfDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const CreatorPanel = lazy(() => import('./pages/CreatorPanel'));
const Resources = lazy(() => import('./pages/Resources'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Components
const UploadForm = lazy(() => import('./components/dashboard/UploadForm'));

const AppContent = () => {
  const { theme } = useContext(AppContext);

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} transition-colors`}>
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={(
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
              <Loader />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading page...</p>
            </div>
          )}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/pdf/:id" element={<PdfDetails />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator"
              element={
                <ProtectedRoute>
                  <CreatorPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/upload"
              element={
                <ProtectedRoute adminOnly>
                  <UploadForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/upload/:courseId"
              element={
                <ProtectedRoute adminOnly>
                  <UploadForm />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>

      <AppContent />

    </Router>
  );
};

export default App;
