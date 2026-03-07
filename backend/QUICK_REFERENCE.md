# PIB BITS API - Quick Reference Card

## 🚀 Quick Start

### 1. Import Collection
- File: `PIB-BITS-API.postman_collection.json`
- Click: Import → Upload Files

### 2. Test Health
```
GET http://localhost:5003/api/health
```

### 3. Upload Files
```
POST http://localhost:5003/api/courses/upload
Form-data: pdf (file), cover (file)
```

Response contains base64 encoded files.

### 4. Create Course
```
POST http://localhost:5003/api/courses
Content-Type: application/json

{
  "title": "Course Title",
  "category": "Banking",
  "price": 499,
  "authorId": "clerk_user_123",
  "author": "Author Name",
  "pdf": "data:application/pdf;base64,...",
  "cover": "data:image/jpeg;base64,...",
  "description": "...",
  "features": ["Feature 1", "Feature 2"]
}
```

### 5. Get Course with PDF
```
GET http://localhost:5003/api/courses/1
```

Returns complete course with embedded PDF and cover image (base64).

---

## 📋 All Endpoints

### Courses
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses?category=Banking` | Filter by category |
| GET | `/api/courses?search=SBI` | Search courses |
| GET | `/api/courses/1` | Get single course |
| POST | `/api/courses/upload` | Upload PDF & cover |
| POST | `/api/courses` | Create course |
| PUT | `/api/courses/1` | Update course |
| DELETE | `/api/courses/1` | Delete course |
| GET | `/api/courses/author/{authorId}` | Get author's courses |

### Users
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/users/sync` | Sync Clerk user |
| GET | `/api/users/{clerkId}` | Get user profile |
| PUT | `/api/users/{clerkId}` | Update profile |
| GET | `/api/users/{clerkId}/purchased-courses` | Get bought courses |
| GET | `/api/users/{clerkId}/created-courses` | Get created courses |

### Admin
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/users/{clerkId}` | User details |
| DELETE | `/api/admin/users/{clerkId}` | Delete user |
| GET | `/api/admin/courses` | All courses |
| DELETE | `/api/admin/courses/{courseId}` | Delete course |

---

## 📤 File Upload in Postman

### Step 1: Upload Files
**URL:** `POST http://localhost:5003/api/courses/upload`

**Body Tab:** Form-data
```
pdf     | [file]  course.pdf
cover   | [file]  course.jpg
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pdf": {
      "filename": "course.pdf",
      "buffer": "JVBERi0xLjQKJeLj..."
    },
    "cover": {
      "filename": "course.jpg",
      "buffer": "/9j/4AAQSkZJRgABA..."
    }
  }
}
```

### Step 2: Copy Base64
- Copy `data.pdf.buffer`
- Copy `data.cover.buffer`

### Step 3: Create Course
**URL:** `POST http://localhost:5003/api/courses`

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "title": "SBI PO 2026",
  "category": "Banking",
  "price": 499,
  "authorId": "user_xxx",
  "pdf": "data:application/pdf;base64,JVBERi0xLjQKJeLj...",
  "cover": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

### Step 4: Get Course
**URL:** `GET http://localhost:5003/api/courses/1`

Response includes the PDF and cover base64 data.

---

## 🔐 Required Fields

### Create Course (POST)
- `title` ✓
- `category` ✓
- `price` ✓
- `authorId` ✓
- `pdf` (base64)
- `cover` (base64)

### Sync User (POST)
- `clerkId` ✓
- `email` ✓
- `firstName` (optional)
- `lastName` (optional)
- `avatar` (optional)

---

## 💾 Example Data

### Categories
- Banking
- SSC
- Government
- General

### Test Prices
- 99 (mini course)
- 299 (standard)
- 499 (premium)
- 999 (comprehensive)

### Sample Author IDs
```
user_2aWJ1kBIXXXXXXXXXXXXXXX (from Clerk)
```

---

## 🧪 Testing Order

1. ✅ Health check
2. ✅ Upload files
3. ✅ Create course (copy base64 from upload)
4. ✅ Get all courses
5. ✅ Get single course (verify PDF included)
6. ✅ Search/filter courses
7. ✅ Update course
8. ✅ Sync user
9. ✅ Get user profile
10. ✅ Admin stats

---

## 🔗 Base64 Format

### PDF
```
data:application/pdf;base64,JVBERi0xLjQKJeLj...
```

### Image (JPEG)
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
```

### Image (PNG)
```
data:image/png;base64,iVBORw0KGgoAAAAN...
```

---

## ✔️ Response Format

### Success (200/201)
```json
{
  "success": true,
  "message": "Action completed",
  "data": { ... }
}
```

### Error (400/404/500)
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 📌 Common Issues

**Issue:** File upload fails
- **Solution:** Use form-data, not raw JSON
- **Check:** Correct field names (pdf, cover)

**Issue:** Course creation fails with 400
- **Solution:** Verify all required fields present
- **Check:** Base64 strings are complete

**Issue:** PDF not showing
- **Solution:** Ensure base64 string starts with "data:application/pdf;base64,"
- **Check:** String isn't truncated

**Issue:** 404 Course not found
- **Solution:** Verify correct course ID
- **Check:** Course was created successfully

---

## 🎯 Postman Variables

Set in Postman Environment:

```json
{
  "base_url": "http://localhost:5003",
  "user_id": "user_2aWJ1kBIXXXXXXXXXXXXXXX",
  "course_id": "1"
}
```

Use in requests:
- `{{base_url}}/api/courses`
- `{{user_id}}` in URL
- `{{course_id}}` in URL

---

## 📚 Backend Running?

Check: `curl http://localhost:5003/api/health`

Should return:
```json
{
  "status": "Backend is running!"
}
```

If not, run:
```bash
cd /Users/sudhanshumishra/Documents/JavaScript/LMS/backend
npm run dev
```
