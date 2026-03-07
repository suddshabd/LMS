# 📮 POSTMAN TESTING GUIDE - Complete API Workflow

## 🎯 Quick Start: Create Course in 2 Steps

### **STEP 1: Upload Files to Cloudinary** 
→ Get Cloudinary URLs

### **STEP 2: Create Course**  
→ Use URLs from Step 1 as `pdfUrl` and `coverUrl`

---

## 📌 STEP 1: Upload PDF & Cover Image

### Endpoint
```
POST /api/courses/upload
```

### In Postman:
1. Set request type to **POST**
2. URL: `http://localhost:5003/api/courses/upload`
3. Go to **Body** tab → Select **form-data**
4. Add two fields:
   - **Key:** `pdf` → **Type:** File → Select your PDF file
   - **Key:** `cover` → **Type:** File → Select your cover image

### Request Example:
```
POST http://localhost:5003/api/courses/upload
Content-Type: multipart/form-data

[Form Data]
pdf: sample.pdf (file)
cover: cover.jpg (file)
```

### Response:
```json
{
  "success": true,
  "message": "Files uploaded to Cloudinary successfully",
  "data": {
    "pdf": {
      "url": "https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/pdfs/pdf_1708512345_sample.pdf",
      "publicId": "pib-bits/pdfs/pdf_1708512345_sample",
      "size": 2048576
    },
    "cover": {
      "url": "https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/covers/cover_1708512345_cover.jpg",
      "publicId": "pib-bits/covers/cover_1708512345_cover",
      "size": 512000
    }
  }
}
```

### ✅ Copy the URLs:
- **pdfUrl:** `https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/pdfs/pdf_1708512345_sample.pdf`
- **coverUrl:** `https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/covers/cover_1708512345_cover.jpg`

---

## 📌 STEP 2: Create Course

### Endpoint
```
POST /api/courses
```

### In Postman:
1. Set request type to **POST**
2. URL: `http://localhost:5003/api/courses`
3. Go to **Headers** tab → Add:
   - **Key:** `Content-Type` → **Value:** `application/json`
4. Go to **Body** tab → Select **raw** → Choose **JSON**

### Request Body:
```json
{
  "title": "Advanced SBI PO Preparation 2026",
  "category": "Banking",
  "subcategory": "SBI PO",
  "price": 499,
  "pages": 450,
  "description": "Complete guide for SBI PO exam preparation with mock tests and solutions",
  "features": [
    "Complete Syllabus",
    "Mock Tests",
    "Expert Tips",
    "Previous Year Papers"
  ],
  "author": "John Trainer",
  "authorId": "teacher_001",
  "pdfUrl": "https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/pdfs/pdf_1708512345_sample.pdf",
  "coverUrl": "https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/covers/cover_1708512345_cover.jpg",
  "rating": 4.5,
  "reviews": 125,
  "students": 2450,
  "downloads": 5600
}
```

### ⚠️ REQUIRED FIELDS:
- ✅ `title` - Course name
- ✅ `category` - Banking / SSC / Government / General
- ✅ `price` - Course price in rupees
- ✅ `authorId` - Teacher/Author unique ID
- ✅ `pdfUrl` - **Cloudinary PDF URL from STEP 1**
- ✅ `coverUrl` - **Cloudinary Image URL from STEP 1**

### Optional Fields:
- `author` - Display name
- `subcategory` - Specific category
- `pages` - Page count
- `description` - Course details
- `features` - Array of features
- `rating`, `reviews`, `students`, `downloads` - Stats

### Response:
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "6998b1cb9f7538b3b3e4287c",
    "title": "Advanced SBI PO Preparation 2026",
    "category": "Banking",
    "price": 499,
    "authorId": "teacher_001",
    "pdfUrl": "https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/pdfs/pdf_1708512345_sample.pdf",
    "coverUrl": "https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/covers/cover_1708512345_cover.jpg",
    "pages": 450,
    "rating": 4.5,
    "reviews": 125,
    "students": 2450,
    "downloads": 5600,
    "createdAt": "2026-02-21T10:30:45.123Z",
    "updatedAt": "2026-02-21T10:30:45.123Z"
  }
}
```

---

## 📋 Complete API Endpoints Reference

### 1️⃣ Health Check
```
GET http://localhost:5003/api/health
```
**Response:** Backend and database status
```json
{
  "status": "Backend is running!",
  "database": "Connected",
  "timestamp": "2026-02-21T..."
}
```

---

### 2️⃣ Get All Courses
```
GET http://localhost:5003/api/courses
```

**Query Parameters (Optional):**
- `category=Banking` - Filter by category
- `search=SBI` - Search in title
- `sort=price` - Sort by field

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "...",
      "title": "...",
      "category": "Banking",
      "price": 499,
      "pdfUrl": "...",
      "coverUrl": "..."
    }
  ]
}
```

---

### 3️⃣ Get Single Course
```
GET http://localhost:5003/api/courses/{courseId}
```

**Example:**
```
GET http://localhost:5003/api/courses/6998b1cb9f7538b3b3e4287c
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6998b1cb9f7538b3b3e4287c",
    "title": "Advanced SBI PO Preparation 2026",
    "category": "Banking",
    "price": 499,
    "pdfUrl": "https://res.cloudinary.com/...",
    "coverUrl": "https://res.cloudinary.com/..."
  }
}
```

---

### 4️⃣ Get Courses by Author
```
GET http://localhost:5003/api/courses/author/{authorId}
```

**Example:**
```
GET http://localhost:5003/api/courses/author/teacher_001
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

### 5️⃣ Update Course
```
PUT http://localhost:5003/api/courses/{courseId}
```

**Example:**
```
PUT http://localhost:5003/api/courses/6998b1cb9f7538b3b3e4287c
```

**Headers:** `Content-Type: application/json`

**Body (Only fields to update):**
```json
{
  "price": 599,
  "pages": 500,
  "description": "Updated description",
  "rating": 4.7
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "_id": "6998b1cb9f7538b3b3e4287c",
    "price": 599,
    "pages": 500
  }
}
```

---

### 6️⃣ Delete Course
```
DELETE http://localhost:5003/api/courses/{courseId}
```

**Example:**
```
DELETE http://localhost:5003/api/courses/6998b1cb9f7538b3b3e4287c
```

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": {...}
}
```

---

## ❌ Error Responses

### Missing Required Fields (PDF or Cover)
```json
{
  "success": false,
  "error": "Missing required fields: title, category, price, authorId, pdfUrl, coverUrl"
}
```

**Fix:** Include all required fields with valid Cloudinary URLs

---

### Course Not Found
```json
{
  "success": false,
  "error": "Course not found"
}
```

**Fix:** Check if course ID is correct

---

### Server Error
```json
{
  "success": false,
  "error": "error message"
}
```

**Fix:** Check backend logs and MongoDB connection

---

## 🧪 Test Workflow

### Complete Flow:

1. **Health Check**
   ```
   GET http://localhost:5003/api/health
   ```

2. **Get All Courses** (view existing)
   ```
   GET http://localhost:5003/api/courses
   ```

3. **Upload Files**
   ```
   POST http://localhost:5003/api/courses/upload
   [Upload PDF + Cover]
   → Get Cloudinary URLs
   ```

4. **Create Course**
   ```
   POST http://localhost:5003/api/courses
   [Use URLs from Step 3]
   → Get Course ID
   ```

5. **Get Single Course** (verify creation)
   ```
   GET http://localhost:5003/api/courses/{courseId}
   ```

6. **Update Course**
   ```
   PUT http://localhost:5003/api/courses/{courseId}
   [Update price/description]
   ```

7. **Filter Courses**
   ```
   GET http://localhost:5003/api/courses?category=Banking
   ```

8. **Get Author Courses**
   ```
   GET http://localhost:5003/api/courses/author/teacher_001
   ```

9. **Delete Course**
   ```
   DELETE http://localhost:5003/api/courses/{courseId}
   ```

10. **Verify Deletion**
    ```
    GET http://localhost:5003/api/courses/{courseId}
    → Should return "Course not found"
    ```

---

## 📸 Postman Collection Import

1. Download the collection: `PIB-BITS-API.postman_collection.json`
2. In Postman: **File** → **Import**
3. Select the JSON file
4. Collection will be imported with all endpoints

### ⚠️ Import Troubleshooting
If you see "Failed to import" in VS Code:
1. **Check File Paths:** Ensure the JSON doesn't contain invalid local paths in `src` fields (we fixed this in the collection).
2. **Import Type:** Make sure you are importing as a **Collection**, not an Environment.
3. **Extension Issues:** If the VS Code extension fails, try using the **Postman Desktop App** which is more robust.
4. **Syntax:** If you edited the JSON manually, ensure there are no trailing commas.

---

## ✅ Validation Rules

| Field | Type | Required | Min | Max | Notes |
|-------|------|----------|-----|-----|-------|
| title | String | ✅ Yes | 3 | 200 | Course name |
| category | String | ✅ Yes | - | - | Banking/SSC/Government/General |
| price | Number | ✅ Yes | 0 | 100000 | In rupees |
| authorId | String | ✅ Yes | 1 | 100 | Teacher ID |
| pdfUrl | String | ✅ Yes | - | - | Valid Cloudinary URL |
| coverUrl | String | ✅ Yes | - | - | Valid Cloudinary URL |
| pages | Number | ❌ No | 0 | 10000 | Page count |
| description | String | ❌ No | 0 | 5000 | Course details |

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Replace localhost with production URL
- [ ] Use production Cloudinary credentials
- [ ] Use production Razorpay keys
- [ ] Connect to production MongoDB
- [ ] Enable HTTPS/SSL
- [ ] Set CORS properly
- [ ] Add authentication headers if needed
- [ ] Test all endpoints with real data
- [ ] Set up error logging
- [ ] Enable database backups

---

**Last Updated:** February 21, 2026
**Status:** ✅ All Routes Working
**Backend:** Running on Port 5003
**Database:** MongoDB Connected
