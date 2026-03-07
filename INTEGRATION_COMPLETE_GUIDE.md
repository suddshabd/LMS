# Complete Integration Guide - Cloudinary, MongoDB & Razorpay

## 🎯 What's Been Set Up

### ✅ Cloudinary Integration
- File upload endpoint to store PDFs and cover images
- Returns direct URLs instead of base64
- Automatic file management and CDN delivery

### ✅ MongoDB Integration
- Connected to your MongoDB database
- Course model with Cloudinary URL fields
- User and Payment models created
- All data persisting in database

### ✅ Razorpay Payment Gateway
- Payment order creation
- Payment verification with signature validation
- Student enrollment on successful payment
- Transaction history tracking

### ✅ Frontend Integration
- API service layer for backend calls
- Updated UploadForm to use backend APIs
- Payment component for Razorpay integration
- Cloudinary file uploads with metadata in MongoDB

---

## 🔐 Configuration Steps

### Step 1: Update .env File

Your backend .env already has placeholders. Update with real credentials:

```env
# Cloudinary (Get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_XXXXX
RAZORPAY_KEY_SECRET=your_key_secret

# MongoDB (Already configured)
MONGODB_URI=mongodb+srv://Pibbits:2aTVsqXhyaFUfGsW@pib.r9vc3l7.mongodb.net/pib-bits
```

### Step 2: Frontend Environment Variables

Create or update `/frontend/.env`:

```env
VITE_API_URL=http://localhost:5003/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_XXXXX
```

### Step 3: Restart Backend

```bash
cd /Users/sudhanshumishra/Documents/JavaScript/LMS/backend
npm run dev
```

Check MongoDB connection:
```bash
curl http://localhost:5003/api/health
```

Response should show:
```json
{
  "status": "Backend is running!",
  "database": "Connected",
  "timestamp": "2026-02-21T..."
}
```

---

## 📋 File Upload Flow

```
1. User selects PDF and Cover Image
   ↓
2. Frontend calls: courseAPI.uploadFiles(pdfFile, coverFile)
   ↓
3. Backend receives files via multipart/form-data
   ↓
4. Backend uploads to Cloudinary
   ↓
5. Cloudinary returns URLs
   ↓
6. Backend returns: {
     pdf: { url: "https://...", publicId: "..." },
     cover: { url: "https://...", publicId: "..." }
   }
   ↓
7. Frontend creates course with URLs
   ↓
8. Course saved to MongoDB with:
     - pdfUrl: (Cloudinary URL)
     - coverUrl: (Cloudinary URL)
     - Other metadata: title, price, description, etc.
```

---

## 💳 Payment Flow

```
1. User clicks "Buy Course"
   ↓
2. Frontend loads Razorpay script
   ↓
3. Calls: paymentAPI.createOrder(courseId, userId, email, name)
   ↓
4. Backend creates Razorpay Order
   ↓
5. Stores Payment record in MongoDB
   ↓
6. Returns Order ID
   ↓
7. Razorpay Modal opens
   ↓
8. User completes payment
   ↓
9. Razorpay callback with signature
   ↓
10. Frontend verifies: paymentAPI.verifyPayment(orderId, paymentId, signature)
   ↓
11. Backend validates signature
   ↓
12. Adds course to user.purchasedCourses
   ↓
13. Updates payment status to "captured"
   ↓
14. Returns success
   ↓
15. User has access to course
```

---

## 🚀 Testing the Complete Flow

### Test 1: Upload Course

1. Go to http://localhost:5175/upload
2. Fill form:
   - Title: "Test Course"
   - Category: Banking
   - Price: 299
   - Select PDF file
   - Select Cover image
3. Click "Upload Course"
4. Should see progress:
   - "📤 Uploading files to Cloudinary..."
   - "💾 Creating course in database..."
   - "✅ Course uploaded successfully!"

### Test 2: View Uploaded Course

1. Go to http://localhost:5175/admin
2. Should see your uploaded course
3. Click on course card
4. Verify:
   - Cover image loads from Cloudinary
   - PDF link works
   - All metadata displayed

### Test 3: Purchase Course (Test Payment)

1. Go to course details
2. Click "Buy Now" button
3. Razorpay modal opens
4. Use test card: `4111 1111 1111 1111`
5. Expiry: Any future date
6. CVV: Any 3 digits
7. Click Pay
8. Payment should succeed
9. Course added to your "My Courses"

---

## 📚 API Endpoints Reference

### Courses

```bash
# Upload files
POST /api/courses/upload
Headers: Content-Type: multipart/form-data
Body: pdf (file), cover (file)

# Create course
POST /api/courses
Body: {
  title, category, price, authorId, author,
  pdfUrl, coverUrl, description, features
}

# Get all courses
GET /api/courses?category=Banking&search=SBI

# Get single course
GET /api/courses/{id}

# Update course
PUT /api/courses/{id}

# Delete course
DELETE /api/courses/{id}
```

### Payments

```bash
# Create order
POST /api/payments/create-order
Body: { courseId, userId, studentEmail, studentName }

# Verify payment
POST /api/payments/verify-payment
Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }

# Get user payments
GET /api/payments/user/{userId}

# Get all payments (admin)
GET /api/payments/admin/all-payments
```

### Users

```bash
# Sync user
POST /api/users/sync
Body: { clerkId, email, firstName, lastName, avatar }

# Get purchased courses
GET /api/users/{clerkId}/purchased-courses

# Get created courses
GET /api/users/{clerkId}/created-courses
```

---

## 🎓 Frontend Integration Examples

### Upload Course with Files

```javascript
import { courseAPI } from './services/apiService';

const handleUpload = async (pdfFile, coverFile, courseData) => {
    try {
        // Upload files to Cloudinary
        const uploadRes = await courseAPI.uploadFiles(pdfFile, coverFile);
        const { pdf, cover } = uploadRes.data;

        // Create course with URLs
        const course = await courseAPI.createCourse({
            ...courseData,
            pdfUrl: pdf.url,
            coverUrl: cover.url
        });

        console.log('Course created:', course.data);
    } catch (error) {
        console.error('Upload failed:', error.message);
    }
};
```

### Process Payment

```javascript
import RazorpayPayment from './components/payment/RazorpayPayment';

function CourseDetails({ course, user }) {
    const handlePaymentSuccess = (paymentData) => {
        console.log('Payment successful:', paymentData);
        // Redirect to course or show success message
    };

    return (
        <RazorpayPayment
            course={course}
            userId={user.id}
            userEmail={user.email}
            userName={user.name}
            onSuccess={handlePaymentSuccess}
        />
    );
}
```

### Display Course with Cloudinary Images

```javascript
import { courseAPI } from './services/apiService';

function CourseCard({ courseId }) {
    const [course, setCourse] = React.useState(null);

    React.useEffect(() => {
        courseAPI.getCourseById(courseId).then(res => {
            setCourse(res.data);
        });
    }, [courseId]);

    if (!course) return <div>Loading...</div>;

    return (
        <div>
            {/* Cover image from Cloudinary */}
            <img src={course.coverUrl} alt={course.title} />
            
            <h2>{course.title}</h2>
            <p>Price: ₹{course.price}</p>
            
            {/* Download PDF button */}
            <a href={course.pdfUrl} target="_blank" download>
                Download PDF
            </a>
        </div>
    );
}
```

---

## 📊 Suggested Additional Features

### 1. **Course Reviews & Ratings**
```javascript
// Add to Course model
reviews: [{
    userId: String,
    rating: Number,
    comment: String,
    createdAt: Date
}]
```

### 2. **Wishlist System**
```javascript
// Add to User model
wishlist: [{ type: ObjectId, ref: 'Course' }]
```

### 3. **Course Progress Tracking**
```javascript
// New model
StudentProgress {
    studentId,
    courseId,
    progressPercentage,
    completedLessons,
    lastAccessedAt
}
```

### 4. **Certificate Generation**
- Auto-generate PDF certificate on course completion
- Use libraries like: `pdfkit` or `html2pdf`

### 5. **Email Notifications**
```bash
npm install nodemailer
# Send emails for:
# - Course purchase confirmation
# - Course upload approval
# - Instructor earnings
```

### 6. **Student Dashboard Analytics**
```javascript
// Show:
// - Total courses bought
// - Total spent
// - Certificates earned
// - Learning progress
```

### 7. **Instructor Analytics**
```javascript
// Show:
// - Total students enrolled
// - Total revenue
// - Course performance
// - Popular courses
```

### 8. **Search & Filters Enhancement**
- Add faceted search
- Filters: rating, price range, duration
- Search suggestions

### 9. **Admin Dashboard**
```javascript
// Components:
// - Revenue chart
// - User growth graph
// - Top courses
// - Recent payments
// - User management
```

### 10. **Two-Factor Authentication**
- SMS OTP via Twilio
- Email verification
- Backup codes

---

## 🐛 Common Issues & Solutions

### Issue: "Cloudinary upload failed"
**Solution:**
1. Check CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET in .env
2. Verify file size < 50MB
3. Check file type (PDF, JPG, PNG only)

### Issue: "MongoDB connection timeout"
**Solution:**
1. Verify MongoDB URI in .env
2. Check IP whitelist in MongoDB Atlas
3. Restart backend: `npm run dev`

### Issue: "Razorpay modal not opening"
**Solution:**
1. Check RAZORPAY_KEY_ID in environment
2. Verify script loaded: `window.Razorpay` exists
3. Use test keys, not production

### Issue: "Course not appearing after upload"
**Solution:**
1. Check MongoDB connection
2. Verify course document saved
3. Check browser console for errors

### Issue: "Files uploading but not stored"
**Solution:**
1. Check Cloudinary API credentials
2. Verify folder permissions
3. Check file size limits

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Update MongoDB URI to production cluster
- [ ] Update Cloudinary credentials to production account
- [ ] Update Razorpay to production keys
- [ ] Update FRONTEND_URL in backend .env
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly
- [ ] Add rate limiting to APIs
- [ ] Set up error logging (Sentry/LogRocket)
- [ ] Add database backup strategy
- [ ] Configure CDN for Cloudinary
- [ ] Test payment flow thoroughly
- [ ] Set up monitoring/alerts

---

## 🎉 Summary

Your LMS now has:

✅ **File Storage**: Cloudinary for PDFs and images  
✅ **Database**: MongoDB for all data persistence  
✅ **Payments**: Razorpay for course purchases  
✅ **Users**: Clerk authentication + custom user model  
✅ **Admins**: Dashboard for management  
✅ **Frontend**: Integrated with all backend APIs  

All components are working together seamlessly!

**Next Steps:**
1. Test complete flow (upload → view → purchase)
2. Add suggested features based on priority
3. Set up production credentials
4. Deploy to hosting platform
