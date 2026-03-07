# Postman Testing Guide - PIB BITS LMS API

## Import Collection

1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `PIB-BITS-API.postman_collection.json`
4. All API endpoints will be ready to test

---

## API Testing Workflow

### Step 1: Health Check
**Endpoint:** `GET http://localhost:5003/api/health`

**Purpose:** Verify backend is running

**Expected Response:**
```json
{
  "status": "Backend is running!",
  "timestamp": "2026-02-20T18:39:04.422Z"
}
```

---

### Step 2: Sync User with Clerk
**Endpoint:** `POST http://localhost:5003/api/users/sync`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "clerkId": "user_2aWJ1kBIXXXXXXXXXXXXXXX",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User synced successfully",
  "data": {
    "clerkId": "user_2aWJ1kBIXXXXXXXXXXXXXXX",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg",
    "role": "student",
    "purchasedCourses": [],
    "createdCourses": [],
    "isActive": true,
    "createdAt": "2026-02-20T18:39:04.422Z",
    "updatedAt": "2026-02-20T18:39:04.422Z"
  }
}
```

**💾 Save the clerkId for later use in other requests**

---

### Step 3: Upload PDF and Cover Image

**Endpoint:** `POST http://localhost:5003/api/courses/upload`

**Headers:** Auto (Postman will set `Content-Type: multipart/form-data`)

**Body Setup in Postman:**
1. Select **Body** tab
2. Choose **form-data**
3. Add field `pdf` → Select file → Choose your PDF
4. Add field `cover` → Select file → Choose your image (JPG/PNG)

**Example Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": {
    "pdf": {
      "filename": "course.pdf",
      "mimetype": "application/pdf",
      "size": 2500000,
      "buffer": "JVBERi0xLjQKJeLj..."
    },
    "cover": {
      "filename": "cover.jpg",
      "mimetype": "image/jpeg",
      "size": 150000,
      "buffer": "/9j/4AAQSkZJRgABA..."
    }
  }
}
```

**💾 Copy the base64 data from `pdf.buffer` and `cover.buffer` for the next step**

---

### Step 4: Create Course with Uploaded Files

**Endpoint:** `POST http://localhost:5003/api/courses`

**Headers:**
```
Content-Type: application/json
```

**Request Body** (Use the base64 data from Step 3):
```json
{
  "title": "Advanced SBI PO Preparation 2026",
  "category": "Banking",
  "subcategory": "SBI PO",
  "price": 499,
  "pages": 450,
  "description": "Complete guide for SBI PO exam with mock tests, solutions, and expert tips",
  "features": ["Complete Syllabus", "Mock Tests", "Expert Tips", "Previous Year Papers"],
  "author": "John Doe",
  "authorId": "user_2aWJ1kBIXXXXXXXXXXXXXXX",
  "pdf": "data:application/pdf;base64,JVBERi0xLjQKJeLj...",
  "cover": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "rating": 4.5,
  "reviews": 125,
  "students": 2450,
  "downloads": 5600
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": 1,
    "title": "Advanced SBI PO Preparation 2026",
    "category": "Banking",
    "subcategory": "SBI PO",
    "price": 499,
    "pages": 450,
    "description": "Complete guide for SBI PO exam...",
    "features": ["Complete Syllabus", "Mock Tests", ...],
    "author": "John Doe",
    "authorId": "user_2aWJ1kBIXXXXXXXXXXXXXXX",
    "pdf": "data:application/pdf;base64,JVBERi0xLjQKJeLj...",
    "cover": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
    "rating": 4.5,
    "reviews": 125,
    "students": 2450,
    "downloads": 5600,
    "createdAt": "2026-02-20T18:39:04.422Z",
    "updatedAt": "2026-02-20T18:39:04.422Z"
  }
}
```

---

### Step 5: Get Course Details with PDF

**Endpoint:** `GET http://localhost:5003/api/courses/1`

**Response includes:**
- ✅ PDF (base64 encoded - you can decode to download)
- ✅ Cover image (base64 encoded)
- ✅ All metadata (title, price, rating, etc.)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Advanced SBI PO Preparation 2026",
    "category": "Banking",
    "price": 499,
    "pdf": "data:application/pdf;base64,JVBERi0xLjQKJeLj...",
    "cover": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
    "rating": 4.5,
    "reviews": 125,
    "students": 2450,
    "downloads": 5600
  }
}
```

---

## Complete Testing Checklist

### File Upload Testing
- [ ] Upload PDF and cover image
- [ ] Verify files are returned as base64
- [ ] Check file sizes and mime types
- [ ] Test with different file sizes

### Course Creation Testing
- [ ] Create course with base64 files
- [ ] Create course with all optional fields
- [ ] Test validation (missing required fields)
- [ ] Verify course ID is auto-generated

### Course Retrieval Testing
- [ ] Get all courses
- [ ] Filter by category (`?category=Banking`)
- [ ] Search by title (`?search=SBI`)
- [ ] Sort by field (`?sort=price`)
- [ ] Get single course by ID
- [ ] Get courses by author

### Course Update Testing
- [ ] Update course details
- [ ] Change price
- [ ] Update rating
- [ ] Change cover/PDF

### Course Deletion Testing
- [ ] Delete course by ID
- [ ] Verify course is removed from list

### User Testing
- [ ] Sync new user
- [ ] Get user profile
- [ ] Update user profile
- [ ] Get purchased courses
- [ ] Get created courses (instructor)

### Admin Testing
- [ ] Get dashboard stats
- [ ] View all users
- [ ] View all courses
- [ ] Delete user
- [ ] Delete course

---

## How to Extract & Download PDF/Images from Response

### In Postman:
1. Copy the base64 string from response (without `data:application/pdf;base64,` prefix)
2. Go to any online base64 decoder or use:
   ```bash
   echo "BASE64_STRING" | base64 -d > output.pdf
   ```

### In Frontend JavaScript:
```javascript
// Create download link
const link = document.createElement('a');
link.href = course.pdf; // Already has "data:application/pdf;base64," prefix
link.download = 'course.pdf';
link.click();
```

---

## Query Parameters

### Get All Courses
**URL:** `GET /api/courses`

**Query Params:**
- `category` - Filter by category (Banking, SSC, Government, General)
- `search` - Search by title
- `sort` - Sort by field (price, rating, title)

**Example:**
```
GET /api/courses?category=Banking&search=SBI&sort=price
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields: title, category, price, authorId"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Course not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Environment Variables

Create a Postman Environment with these variables:

```json
{
  "base_url": "http://localhost:5003",
  "user_id": "user_2aWJ1kBIXXXXXXXXXXXXXXX",
  "course_id": "1"
}
```

Then use in requests:
- `{{base_url}}/api/courses`
- `{{user_id}}` for user endpoints
- `{{course_id}}` for course endpoints

---

## API Base URL

**Development:** `http://localhost:5003`

All endpoints start with `/api/v1` in production, but currently use `/api`

---

## Postman Tips

1. **Collections Runner:** Test all endpoints in sequence
2. **Pre-request Scripts:** Auto-generate Clerk tokens
3. **Tests:** Add assertions to validate responses
4. **Variables:** Store IDs for chaining requests
5. **Environments:** Switch between dev, staging, production
