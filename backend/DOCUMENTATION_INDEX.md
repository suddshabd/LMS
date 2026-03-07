# PIB BITS API - Complete Testing Documentation Index

## 📚 Documentation Files Overview

### 1. **PIB-BITS-API.postman_collection.json** (14 KB)
**What it is:** Ready-to-import Postman collection with all API endpoints  
**Contains:** 30+ pre-configured requests across 6 categories  
**How to use:**
1. Open Postman
2. Click Import → Upload Files
3. Select `PIB-BITS-API.postman_collection.json`
4. All endpoints ready to test

**Includes:**
- Health checks
- File uploads
- Course CRUD operations
- User management
- Admin dashboard
- Search and filtering

---

### 2. **POSTMAN_TESTING_GUIDE.md** (7.4 KB)
**What it is:** Step-by-step guide for testing APIs in Postman  
**Best for:** Learning the complete workflow  
**Contains:**
- Health check setup
- User sync instructions
- File upload procedures
- Course creation with files
- Course retrieval with PDF details
- Testing checklist (30+ items)

**Key Sections:**
```
✓ Step 1: Health Check
✓ Step 2: Sync User with Clerk
✓ Step 3: Upload PDF and Cover Image
✓ Step 4: Create Course with Uploaded Files
✓ Step 5: Get Course Details with PDF
```

---

### 3. **QUICK_REFERENCE.md** (5.5 KB)
**What it is:** One-page quick reference card  
**Best for:** Quick lookups while testing  
**Contains:**
- All 14 endpoints in table format
- File upload 5-step process
- Required fields checklist
- Query parameters
- Common issues & solutions
- Response format examples

**Perfect for:** Keeping open in one tab while testing in another

---

### 4. **API_FLOW_DIAGRAM.md** (11 KB)
**What it is:** Visual flowcharts and ASCII diagrams  
**Best for:** Understanding the complete data flow  
**Contains:**
- Complete upload → retrieve flow with ASCII art
- Full API endpoint map
- Postman request sequence (8 steps)
- Data flow diagram
- Testing checklist
- Response status codes
- Copy-paste curl examples

---

### 5. **PDF_EXTRACTION_GUIDE.md** (9.5 KB)
**What it is:** Detailed guide for working with PDF and image data  
**Best for:** Understanding base64 encoding and file extraction  
**Contains:**
- 5 methods to extract PDF from response
- Terminal commands to convert base64 → PDF
- Python, Node.js, and JavaScript examples
- Browser download implementation
- Image extraction procedures
- Complete example with Python
- Debugging checklist

**Code Examples:**
```bash
# Terminal
echo "BASE64_STRING" | base64 -d > course.pdf

# Python, Node.js, JavaScript provided
# Browser implementation with download link
```

---

## 🎯 Which File Should I Use?

### For First-Time Setup
1. **Start with:** QUICK_REFERENCE.md (2 min read)
2. **Then import:** PIB-BITS-API.postman_collection.json
3. **Keep open:** POSTMAN_TESTING_GUIDE.md

### For Understanding Data Flow
1. **Read:** API_FLOW_DIAGRAM.md
2. **Follow:** The numbered sequence (1-8 steps)
3. **Reference:** QUICK_REFERENCE.md

### For File Upload Details
1. **Start with:** POSTMAN_TESTING_GUIDE.md (Step 3)
2. **Deep dive:** PDF_EXTRACTION_GUIDE.md
3. **Quick copy:** QUICK_REFERENCE.md file upload section

### For Troubleshooting
1. **Check:** QUICK_REFERENCE.md "Common Issues" section
2. **Debug:** PDF_EXTRACTION_GUIDE.md "Debugging" section
3. **Verify:** POSTMAN_TESTING_GUIDE.md "Testing Checklist"

---

## 🚀 Quick Start (5 Minutes)

### 1. Import Collection (1 min)
```
File: PIB-BITS-API.postman_collection.json
Postman: Import → Upload Files → Select file
```

### 2. Run Health Check (1 min)
```
Endpoint: GET /api/health
Expected: {"status": "Backend is running!"}
```

### 3. Upload Files (1 min)
```
Endpoint: POST /api/courses/upload
Body: form-data with pdf and cover files
Response: Base64 encoded files
```

### 4. Create Course (1 min)
```
Endpoint: POST /api/courses
Body: JSON with base64 files + metadata
Response: Course created with ID
```

### 5. Get Course (1 min)
```
Endpoint: GET /api/courses/{id}
Response: Complete course data with PDF
```

---

## 📋 API Endpoints Summary

### File Management
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/courses/upload` | POST | Upload PDF & cover image files |

### Courses (CRUD)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/courses` | GET | List all courses (with filters) |
| `/api/courses` | POST | Create new course |
| `/api/courses/{id}` | GET | Get single course with PDF |
| `/api/courses/{id}` | PUT | Update course |
| `/api/courses/{id}` | DELETE | Delete course |
| `/api/courses/author/{authorId}` | GET | Get instructor's courses |

### Users
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users/sync` | POST | Sync Clerk user |
| `/api/users/{clerkId}` | GET | Get user profile |
| `/api/users/{clerkId}` | PUT | Update profile |
| `/api/users/{clerkId}/purchased-courses` | GET | Get bought courses |
| `/api/users/{clerkId}/created-courses` | GET | Get created courses |

### Admin
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/stats` | GET | Dashboard statistics |
| `/api/admin/users` | GET | List all users |
| `/api/admin/users/{clerkId}` | GET | Get user details |
| `/api/admin/users/{clerkId}` | DELETE | Delete user |
| `/api/admin/courses` | GET | List all courses |
| `/api/admin/courses/{courseId}` | DELETE | Delete course |

---

## 🔑 Key Concepts

### Base64 Encoding
Files are uploaded as base64 strings in course creation:
```json
{
  "pdf": "data:application/pdf;base64,JVBERi0xLjQKJeLj...",
  "cover": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

### File Upload Flow
```
1. Select PDF & Image files
2. POST to /api/courses/upload
3. Receive base64 encoded data
4. Include in course creation request
5. Retrieve via GET /api/courses/{id}
```

### Response Structure
```json
{
  "success": true/false,
  "message": "Optional message",
  "data": { /* Response data */ },
  "error": "Optional error message"
}
```

---

## 💾 Database Storage Note

Currently using **in-memory storage** for development.

When ready to integrate MongoDB:
1. Models are prepared in `/backend/models/`
2. Services abstract database layer
3. Minimal changes needed in controllers
4. PDFs should be stored in filesystem, not database

---

## 🔧 Server Management

### Start Backend
```bash
cd /Users/sudhanshumishra/Documents/JavaScript/LMS/backend
npm run dev
```

### Check Server Status
```bash
curl http://localhost:5003/api/health
```

### Backend Running?
- Port: **5003**
- Frontend: **5175**
- API URL: `http://localhost:5003/api/`

---

## 📞 Common Questions

### Q: How do I download PDFs?
**A:** See [PDF_EXTRACTION_GUIDE.md](PDF_EXTRACTION_GUIDE.md)

### Q: What if file upload fails?
**A:** Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → Common Issues

### Q: How to test all endpoints sequentially?
**A:** Use Postman Collections Runner: Collections → Run

### Q: Can I use curl instead of Postman?
**A:** Yes! See curl examples in [API_FLOW_DIAGRAM.md](API_FLOW_DIAGRAM.md)

### Q: Where's my uploaded data stored?
**A:** In-memory for now. Persists during server session.

---

## 📱 Environment Setup

### Postman Environment Variables
Create in Postman Settings:

```json
{
  "base_url": "http://localhost:5003",
  "user_id": "user_2aWJ1kBIXXXXXXXXXXXXXXX",
  "course_id": "1"
}
```

Use in requests: `{{base_url}}/api/courses`

---

## 🎓 Learning Path

**Beginner:**
1. Read QUICK_REFERENCE.md (5 min)
2. Import collection (1 min)
3. Run all "hello world" requests (5 min)

**Intermediate:**
1. Follow POSTMAN_TESTING_GUIDE.md (20 min)
2. Test complete upload flow (15 min)
3. Explore filtering/searching (10 min)

**Advanced:**
1. Study API_FLOW_DIAGRAM.md (15 min)
2. Implement in your app (use PDF_EXTRACTION_GUIDE.md)
3. Set up pre-request scripts in Postman
4. Create test assertions

---

## ✅ Testing Checklist

- [ ] Import Postman collection
- [ ] Health check passes
- [ ] Upload files successfully
- [ ] Create course with files
- [ ] Get course and verify PDF included
- [ ] Search/filter courses
- [ ] Sync user
- [ ] Get user profile
- [ ] Admin stats working
- [ ] Delete operations work

---

## 📖 File Size Guide

| Document | Size | Read Time |
|----------|------|-----------|
| QUICK_REFERENCE.md | 5.5 KB | 3-4 min |
| POSTMAN_TESTING_GUIDE.md | 7.4 KB | 5-7 min |
| API_FLOW_DIAGRAM.md | 11 KB | 5-10 min |
| PDF_EXTRACTION_GUIDE.md | 9.5 KB | 8-10 min |
| **Total** | **33 KB** | **20-30 min** |

---

## 🎯 Next Steps

1. **Now:** Import collection → test endpoints
2. **Soon:** Connect frontend to backend APIs
3. **Next:** Implement file download in React
4. **Later:** Add MongoDB integration
5. **Final:** Deploy to production

---

## 📞 Support

If endpoints aren't working:
1. Check backend is running: `curl http://localhost:5003/api/health`
2. Verify ports: Backend on 5003, Frontend on 5175
3. Check request format in Postman
4. Review error response message
5. See POSTMAN_TESTING_GUIDE.md → Error Responses section

---

## 🎉 You're All Set!

Everything needed to test the complete API is ready:

✅ Postman collection with all endpoints  
✅ Step-by-step guides  
✅ Quick reference card  
✅ Visual flow diagrams  
✅ PDF extraction examples  
✅ Backend running on port 5003  

**Start testing now!** 🚀
