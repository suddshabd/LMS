import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import * as Sentry from '@sentry/react'
import { AppProvider } from './context/AppContext'  // 👈 ADD THIS
import { ToastProvider } from './context/ToastContext'
import './index.css'
import App from './App.jsx'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const sentryDsn = import.meta.env.VITE_SENTRY_DSN

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0.1),
  })
}

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ClerkProvider publishableKey={clerkPubKey}>
    <AppProvider>   {/* 👈 WRAP YOUR APP */}
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppProvider>
  </ClerkProvider>
  // </StrictMode>,
)
