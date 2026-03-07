# LMS Frontend - Project Structure

## Overview
This is a modern React-based Learning Management System (LMS) frontend built with Vite, Tailwind CSS, and React Router.

## Directory Structure

```
frontend/src/
│
├── assets/
│   ├── images/          # Product images, backgrounds, etc.
│   ├── icons/           # SVG icons and icon assets
│   └── assets.js        # Centralized asset exports
│
├── components/
│   ├── layout/          # Layout components (Navbar, Footer, Sidebar)
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── index.js     # Named exports
│   │
│   ├── ui/              # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Loader.jsx
│   │   ├── Badge.jsx
│   │   └── index.js     # Named exports
│   │
│   ├── pdf/             # PDF-related components
│   │   ├── PdfCard.jsx
│   │   ├── PdfPreview.jsx
│   │   ├── PdfViewer.jsx
│   │   └── index.js     # Named exports
│   │
│   └── dashboard/       # Dashboard components
│       ├── CreatorStats.jsx
│       ├── EarningsChart.jsx
│       ├── UploadForm.jsx
│       └── index.js     # Named exports
│
├── context/
│   └── AppContext.jsx   # Global state management with Context API
│
├── hooks/
│   ├── useAuthSync.js   # Authentication synchronization hook
│   ├── useFetch.js      # Custom fetch hook
│   └── index.js         # Named exports
│
├── pages/
│   ├── Home.jsx         # Landing page
│   ├── Explore.jsx      # PDF exploration with filters
│   ├── PdfDetails.jsx   # Individual PDF details
│   ├── Checkout.jsx     # Shopping cart & checkout
│   ├── Dashboard.jsx    # User dashboard
│   ├── AdminPanel.jsx   # Admin management interface
│   ├── CreatorPanel.jsx # Creator/seller dashboard
│   └── NotFound.jsx     # 404 page
│
├── routes/
│   └── ProtectedRoute.jsx # Route protection wrapper
│
├── services/
│   ├── api.js           # Base API client (GET, POST, PUT, DELETE)
│   ├── pdfService.js    # PDF-related API calls
│   ├── paymentService.js # Payment processing API calls
│   └── index.js         # Named exports
│
├── utils/
│   ├── constants.js     # Application constants
│   ├── formatCurrency.js # Currency & date formatting utilities
│   └── index.js         # Utility exports
│
├── App.jsx              # Main application component with routing
├── main.jsx             # React entry point
└── index.css            # Global styles
```

## Component Descriptions

### Layout Components (`components/layout/`)
- **Navbar**: Top navigation bar with links and user menu
- **Footer**: Footer with links, about, and copyright
- **Sidebar**: Side navigation menu (hidden on mobile)

### UI Components (`components/ui/`)
- **Button**: Reusable button with variants (primary, secondary, danger, success)
- **Card**: Wrapper component for content boxes
- **Modal**: Dialog/popup component
- **Loader**: Loading spinner animation
- **Badge**: Status/category badge component

### PDF Components (`components/pdf/`)
- **PdfCard**: Card display for individual PDFs in grid
- **PdfPreview**: Modal preview of PDF details
- **PdfViewer**: PDF rendering component

### Dashboard Components (`components/dashboard/`)
- **CreatorStats**: Statistics cards for dashboard
- **EarningsChart**: Revenue chart visualization
- **UploadForm**: Form for uploading new PDFs

### Pages
- **Home**: Landing page with featured PDFs
- **Explore**: PDF listing with filtering and search
- **PdfDetails**: Single PDF view with purchase option
- **Checkout**: Shopping cart and payment
- **Dashboard**: User's personal dashboard
- **AdminPanel**: Admin management interface
- **CreatorPanel**: Creator/seller dashboard
- **NotFound**: 404 error page

## Services

### api.js
RESTful API client with methods:
- `get(endpoint, options)`
- `post(endpoint, body, options)`
- `put(endpoint, body, options)`
- `delete(endpoint, options)`

### pdfService.js
PDF operations:
- Get all PDFs with filters
- Get single PDF
- Search PDFs
- Upload PDF
- Update/Delete PDFs
- Download PDFs

### paymentService.js
Payment operations:
- Create payment intent
- Process payment
- Verify payment
- Get payment history
- Refund payment

## Hooks

### useAuthSync
Synchronizes authentication state from localStorage with backend

### useFetch
Custom hook for fetching data with loading and error states

## Context

### AppContext
Global app state including:
- User authentication state
- Theme settings
- Notifications
- Login/Logout methods

## Utilities

### constants.js
Configuration and constants:
- API base URL
- Routes
- Categories
- User roles
- Pagination settings

### formatCurrency.js
Formatting utilities:
- `formatCurrency()` - Format numbers as currency
- `formatDate()` - Format dates
- `formatNumber()` - Format numbers with thousands separators

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## Environment Variables
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:5000/api
```

## Key Technologies
- **React 19.2.0** - UI Framework
- **Vite 7.3.1** - Build tool
- **Tailwind CSS 4.2.0** - Styling
- **React Router DOM 7.13.0** - Routing
- **Quill 2.0.3** - Rich text editor
- **ESLint 9.39.1** - Code linting

## Best Practices
1. Use index.js files for organized exports
2. Keep components focused and reusable
3. Use Tailwind CSS for styling
4. Centralize API calls in services
5. Use Context API for global state
6. Implement error boundaries for error handling
7. Use custom hooks for logic reuse

## Contributing
When adding new components:
1. Create in appropriate directory
2. Add export to index.js
3. Follow naming conventions (PascalCase for components)
4. Add PropTypes or TypeScript for type safety
5. Include JSDoc comments for documentation
