# API Testing Flow Diagram

## Complete Upload & Retrieve Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PIB BITS LMS API Testing Flow                     │
└─────────────────────────────────────────────────────────────────────┘

STEP 1: VERIFY BACKEND
─────────────────────
┌─────────────────────┐
│ GET /api/health     │
│                     │
│ Response:           │
│ {                   │
│   "status": "OK"    │
│ }                   │
└─────────────────────┘
         ↓
STEP 2: UPLOAD FILES
────────────────────
┌──────────────────────────┐
│ POST /api/courses/upload │
│                          │
│ Form-data:               │
│ • pdf (file)             │
│ • cover (file)           │
│                          │
│ Response:                │
│ {                        │
│   "data": {              │
│     "pdf": {             │
│       "buffer": "base64" │
│     },                   │
│     "cover": {           │
│       "buffer": "base64" │
│     }                    │
│   }                      │
│ }                        │
└──────────────────────────┘
         ↓
    📋 COPY:
    - pdf.buffer
    - cover.buffer
         ↓
STEP 3: CREATE COURSE
─────────────────────
┌──────────────────────────┐
│ POST /api/courses        │
│                          │
│ JSON Body:               │
│ {                        │
│   "title": "SBI PO",     │
│   "category": "Banking", │
│   "price": 499,          │
│   "authorId": "user_xxx",│
│   "pdf": "data:app/pdf;  │
│           base64,XXX",   │
│   "cover": "data:image/  │
│            base64,YYY"   │
│ }                        │
│                          │
│ Response:                │
│ {                        │
│   "success": true,       │
│   "data": {              │
│     "id": "1",           │
│     "title": "SBI PO",   │
│     ...                  │
│   }                      │
│ }                        │
└──────────────────────────┘
         ↓
STEP 4: RETRIEVE COURSE
──────────────────────
┌──────────────────────────┐
│ GET /api/courses/1       │
│                          │
│ Response:                │
│ {                        │
│   "success": true,       │
│   "data": {              │
│     "id": "1",           │
│     "title": "SBI PO",   │
│     "price": 499,        │
│     "pdf": "data:app/...",
│     "cover": "data:img..",
│     "description": "...", │
│     "rating": 4.5,       │
│     "students": 2450,    │
│     ...                  │
│   }                      │
│ }                        │
└──────────────────────────┘
         ↓
STEP 5: DOWNLOAD PDF
────────────────────
In Browser:
  const link = document.createElement('a');
  link.href = course.pdf;  // Already base64
  link.download = 'course.pdf';
  link.click();


════════════════════════════════════════════════════════════════════════


FULL API ENDPOINT MAP
═════════════════════

                         PIB BITS LMS API (localhost:5003)
                                    |
                 ___________________┼___________________
                |                   |                   |
            /api/courses       /api/users          /api/admin
                |                   |                   |
    ┌───────────┼───────────┐      |      ┌────────────┼────────────┐
    |           |           |      |      |            |            |
   GET         POST        GET    POST   GET         GET           GET
  (list)      (create)   (upload) (sync) (single)   (profile)    (stats)
    |           |           |      |      |            |            |
   ?cat       raw JSON   form-data JSON  /{id}     /{clerkId}    /stats
  ?search      +pdf       pdf     clerkId  /1       /sync         
  ?sort        +cover     cover   email    /author  /{clerkId}/
                         /{id}           purchased-
                                         courses
                                         /{clerkId}/
                                         created-
                                         courses


════════════════════════════════════════════════════════════════════════


POSTMAN REQUEST SEQUENCE
════════════════════════

1️⃣  HEALTH CHECK
   ├─ Method: GET
   ├─ URL: http://localhost:5003/api/health
   ├─ Headers: (none)
   └─ Body: (empty)

2️⃣  FILE UPLOAD
   ├─ Method: POST
   ├─ URL: http://localhost:5003/api/courses/upload
   ├─ Headers: Content-Type: multipart/form-data (auto)
   └─ Body: form-data
       ├─ pdf: [select file]
       └─ cover: [select file]

3️⃣  USER SYNC (Optional)
   ├─ Method: POST
   ├─ URL: http://localhost:5003/api/users/sync
   ├─ Headers: Content-Type: application/json
   └─ Body: raw JSON
       ├─ clerkId: "user_xxx"
       ├─ email: "user@example.com"
       ├─ firstName: "John"
       └─ lastName: "Doe"

4️⃣  CREATE COURSE
   ├─ Method: POST
   ├─ URL: http://localhost:5003/api/courses
   ├─ Headers: Content-Type: application/json
   └─ Body: raw JSON
       ├─ title: "SBI PO 2026"
       ├─ category: "Banking"
       ├─ price: 499
       ├─ authorId: "user_xxx"
       ├─ author: "John Doe"
       ├─ pdf: "data:application/pdf;base64,JVB..."
       ├─ cover: "data:image/jpeg;base64,/9j/..."
       └─ description: "..."

5️⃣  GET ALL COURSES
   ├─ Method: GET
   ├─ URL: http://localhost:5003/api/courses
   ├─ Headers: (none)
   └─ Query Params: (optional)
       ├─ category: "Banking"
       ├─ search: "SBI"
       └─ sort: "price"

6️⃣  GET SINGLE COURSE (WITH PDF)
   ├─ Method: GET
   ├─ URL: http://localhost:5003/api/courses/1
   ├─ Headers: (none)
   └─ Body: (empty)

7️⃣  UPDATE COURSE
   ├─ Method: PUT
   ├─ URL: http://localhost:5003/api/courses/1
   ├─ Headers: Content-Type: application/json
   └─ Body: raw JSON (only fields to update)
       ├─ title: "New Title"
       ├─ price: 599
       └─ rating: 4.7

8️⃣  DELETE COURSE
   ├─ Method: DELETE
   ├─ URL: http://localhost:5003/api/courses/1
   ├─ Headers: (none)
   └─ Body: (empty)


════════════════════════════════════════════════════════════════════════


DATA FLOW DIAGRAM
═════════════════

User Files (PDF + Image)
    ↓
    └─→ [Multer] → Memory Storage → Base64 Encoding
        ↓
        └─→ Upload Endpoint Response
            ├─ pdf.buffer (base64)
            └─ cover.buffer (base64)
    ↓
Copy Base64 Strings
    ↓
    └─→ Include in Course Creation Request
        ├─ pdf: "data:application/pdf;base64,..."
        └─ cover: "data:image/jpeg;base64,..."
    ↓
Course Saved in Memory Storage
    ├─ ID: auto-generated
    ├─ Title, Price, Category
    ├─ PDF (base64 stored)
    └─ Cover (base64 stored)
    ↓
Retrieve via GET /api/courses/{id}
    ├─ Returns all fields including PDF
    └─ PDF can be decoded/downloaded


════════════════════════════════════════════════════════════════════════


TESTING CHECKLIST
═════════════════

FILE UPLOAD
☐ Test with PDF < 1MB
☐ Test with PDF 5-10MB
☐ Test with JPEG image
☐ Test with PNG image
☐ Test with invalid file type
☐ Verify response includes base64

COURSE CREATION
☐ Create with all fields
☐ Create with required fields only
☐ Test missing title → 400 error
☐ Test missing category → 400 error
☐ Test missing price → 400 error
☐ Test invalid base64 PDF
☐ Verify course ID auto-generated

COURSE RETRIEVAL
☐ Get all courses → array response
☐ Filter by category → filtered results
☐ Search by title → matching results
☐ Get single course → includes PDF
☐ Get non-existent course → 404 error

USER MANAGEMENT
☐ Sync new user → user created
☐ Get user profile → user data returned
☐ Update user profile → fields updated
☐ Get user's purchased courses → array
☐ Get user's created courses → array

ADMIN OPERATIONS
☐ Get dashboard stats → statistics
☐ Get all users → user list
☐ Delete user → user removed
☐ Get all courses → all courses including inactive
☐ Delete course → course removed


════════════════════════════════════════════════════════════════════════


RESPONSE STATUS CODES
═════════════════════

200 OK              ✅ Successful GET, PUT, DELETE
201 Created         ✅ Successful POST (new resource)
400 Bad Request     ❌ Invalid data, missing fields
404 Not Found       ❌ Resource doesn't exist
500 Server Error    ❌ Backend error


════════════════════════════════════════════════════════════════════════


QUICK COPY-PASTE EXAMPLES
═════════════════════════

Upload Endpoint:
curl -X POST http://localhost:5003/api/courses/upload \
  -F "pdf=@/path/to/file.pdf" \
  -F "cover=@/path/to/image.jpg"

Get All Courses:
curl http://localhost:5003/api/courses

Get Single Course:
curl http://localhost:5003/api/courses/1

Filter by Category:
curl "http://localhost:5003/api/courses?category=Banking"
