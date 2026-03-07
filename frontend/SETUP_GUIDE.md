# ExamHub - Course PDF Marketplace

A modern, responsive web application for selling exam preparation course PDFs. Built with React, Tailwind CSS, Vite, and Clerk authentication.

## 🎯 Features

### For Students
- **Browse & Filter Courses** - Advanced filtering by category, price, rating, and search
- **Secure Authentication** - Powered by Clerk for seamless sign-in/sign-up
- **Responsive Design** - Perfect experience on mobile, tablet, and desktop
- **Course Details** - Comprehensive course information with reviews and features
- **Purchase System** - Secure checkout with multiple payment options
- **Personal Dashboard** - Track purchased courses, wishlist, and learning progress
- **Course Preview** - Preview 10% of course before purchase

### Courses Included
- **Banking Exams** - SBI PO, IBPS Clerk, RBI Assistant, Insurance Agent
- **SSC Exams** - CGL, CHSL, CPF SI/ASI, MTS
- **Government Jobs** - UPSC, Railway NTPC
- **General Preparation** - Quantitative Aptitude, English Language

### Technical Features
- Fast performance with Vite
- Responsive Tailwind CSS styling
- Modern React 19 with hooks
- Smooth animations and transitions
- Mobile-first approach
- Professional UI/UX

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn
- Clerk account (free tier available)

### Installation

1. **Clone the repository**
```bash
cd /Users/sudhanshumishra/Documents/JavaScript/LMS/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Clerk Authentication**
   - Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
   - Create a free account
   - Create a new application
   - Copy your Publishable Key

4. **Create .env.local file**
```bash
cp .env.example .env.local
```

5. **Add Clerk key to .env.local**
```
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
VITE_API_URL=http://localhost:5000/api
```

6. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📁 Project Structure

```
frontend/src/
├── components/
│   ├── layout/          # Navbar, Footer, Sidebar
│   ├── ui/              # Reusable UI components
│   ├── pdf/             # PDF-specific components
│   └── dashboard/       # Dashboard components
├── pages/               # Page components
├── data/                # Static course data
├── context/             # React Context for state
├── hooks/               # Custom React hooks
├── services/            # API service functions
├── utils/               # Utility functions
├── routes/              # Route protection
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## 🎨 Responsive Design

- **Mobile** (< 640px) - Single column, optimized touch targets
- **Tablet** (640px - 1024px) - Two-column layout
- **Desktop** (> 1024px) - Full multi-column experience

All components are fully responsive with Tailwind CSS media queries.

## 🔐 Authentication with Clerk

### Key Benefits
- **Zero-setup OAuth** - Built-in social login (Google, GitHub, etc.)
- **Security** - Enterprise-grade security out of the box
- **User Management** - Built-in user profile and preferences
- **Session Management** - Automatic token refresh

### Protected Routes
- `/dashboard` - User's course dashboard
- `/checkout` - Shopping checkout
- `/creator` - Creator panel (future)
- `/admin` - Admin panel (future)

## 🛍️ Course Purchase Flow

1. **Browse** - User explores courses with advanced filters
2. **View Details** - See comprehensive course information
3. **Preview** - Preview 10% of the course
4. **Authenticate** - Sign in if not logged in
5. **Purchase** - Complete payment
6. **Access** - Immediately access full course material
7. **Track** - Monitor in personal dashboard

## 🎯 Available Courses

### Banking (5 courses)
- SBI PO Complete Guide - ₹299
- IBPS Bank Clerk Master - ₹199
- RBI Assistant Preparation - ₹249
- Insurance Agent Exam Guide - ₹149
- Plus more...

### SSC (4 courses)
- SSC CGL Advanced Preparation - ₹399
- SSC CHSL Complete Package - ₹349
- SSC CPF SI/ASI Guide - ₹299
- SSC MTS Exam Master - ₹199

### Government & General
- UPSC Prelims Strategy - ₹499
- Railway NTPC Complete Guide - ₹249
- Quantitative Aptitude Mastery - ₹199
- English Language & Comprehension - ₹179

## 🔧 Customization

### Add New Courses
Edit `/src/data/courses.js`:
```javascript
{
  id: 13,
  title: 'Your Course Title',
  category: 'Category',
  subcategory: 'Subcategory',
  price: 299,
  rating: 4.8,
  reviews: 1500,
  students: 10000,
  author: 'Author Name',
  image: '🎓',
  description: 'Course description...',
  pages: 500,
  downloads: 5000,
  features: ['Feature 1', 'Feature 2', ...]
}
```

### Customize Colors
Edit Tailwind colors in components using className:
- Primary: `bg-blue-600` (change to your brand color)
- Secondary: `bg-indigo-700`
- Success: `bg-green-500`

### Add Logo
Replace the 📚 emoji in Navbar with your logo:
```jsx
<img src="/logo.png" alt="ExamHub" className="h-8" />
```

## 📱 Mobile Optimization

- Touch-friendly buttons (min 44px)
- Collapsible mobile menu
- Readable font sizes on all devices
- Optimized images and lazy loading
- Fast load times with Vite

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy using Vercel CLI or Git integration
```

### Netlify
```bash
npm run build
# Drop build folder on Netlify
```

### Self-hosted (Node.js)
```bash
npm run build
npm run preview
```

### Environment Variables for Production
- Update Clerk Publishable Key for your domain
- Configure CORS for API backend
- Set up secure payment processing

## 🔗 API Integration

The app is ready to integrate with a backend API:
- All API calls in `/src/services/`
- Example: `pdfService.js` for PDF operations
- `paymentService.js` for payment processing
- Update `VITE_API_URL` in `.env.local`

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk Documentation](https://clerk.com/docs)
- [Vite Guide](https://vitejs.dev)

## 🤝 Support

For issues or questions:
- Check the documentation
- Review code comments
- Check component prop types

## 📝 License

This project is ready for commercial use.

## 🎉 Next Steps

1. ✅ Set up Clerk authentication
2. ✅ Run `npm run dev`
3. ✅ Sign in with your email or social account
4. ✅ Browse courses
5. ✅ Build your backend API to process payments
6. ✅ Deploy to Vercel/Netlify
7. ✅ Launch your platform!

---

**Built with ❤️ for exam aspirants everywhere**
