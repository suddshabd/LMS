# 🧪 COPY-PASTE CURL COMMANDS FOR TESTING

## Test 1: Health Check
```bash
curl http://localhost:5003/api/health | jq .
```

---

## Test 2: Get All Courses
```bash
curl http://localhost:5003/api/courses | jq '.count'
```

---

## Test 3: Create WITHOUT PDF (Should Fail)
```bash
curl -X POST http://localhost:5003/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test",
    "category":"Banking",
    "price":299,
    "authorId":"USER1"
  }' | jq '{success, error}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Missing required fields: title, category, price, authorId, pdfUrl, coverUrl"
}
```

---

## Test 4: Create WITHOUT COVER (Should Fail)
```bash
curl -X POST http://localhost:5003/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test",
    "category":"Banking",
    "price":299,
    "authorId":"USER1",
    "pdfUrl":"https://example.com/file.pdf"
  }' | jq '{success, error}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Missing required fields: title, category, price, authorId, pdfUrl, coverUrl"
}
```

---

## Test 5: Create WITH PDF & COVER (Success)
```bash
curl -X POST http://localhost:5003/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Advanced SBI PO Preparation",
    "category":"Banking",
    "price":499,
    "authorId":"teacher_001",
    "author":"John Trainer",
    "pdfUrl":"https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/pdfs/sample.pdf",
    "coverUrl":"https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/covers/cover.jpg",
    "pages":450,
    "description":"Complete guide for SBI PO exam"
  }' | jq '.data._id'
```

**Expected Response:**
```
"6998b1cb9f7538b3b3e4287c"
```

---

## Test 6: Get Single Course
```bash
# Replace with actual course ID from Test 5
curl http://localhost:5003/api/courses/6998b1cb9f7538b3b3e4287c | jq '.data | {title, price, pdfUrl}'
```

**Expected Response:**
```json
{
  "title": "Advanced SBI PO Preparation",
  "price": 499,
  "pdfUrl": "https://res.cloudinary.com/pib-bits/image/upload/v1/pib-bits/pdfs/sample.pdf"
}
```

---

## Test 7: Filter by Category
```bash
curl "http://localhost:5003/api/courses?category=Banking" | jq '.count'
```

**Expected Response:**
```
3
```

---

## Test 8: Search Courses
```bash
curl "http://localhost:5003/api/courses?search=SBI" | jq '.count'
```

---

## Test 9: Get Courses by Author
```bash
curl http://localhost:5003/api/courses/author/teacher_001 | jq '.count'
```

---

## Test 10: Update Course
```bash
curl -X PUT http://localhost:5003/api/courses/6998b1cb9f7538b3b3e4287c \
  -H "Content-Type: application/json" \
  -d '{
    "price": 599,
    "pages": 500,
    "description": "Updated with advanced topics"
  }' | jq '.message'
```

**Expected Response:**
```
"Course updated successfully"
```

---

## Test 11: Verify Update
```bash
curl http://localhost:5003/api/courses/6998b1cb9f7538b3b3e4287c | jq '.data.price'
```

**Expected Response:**
```
599
```

---

## Test 12: Delete Course
```bash
curl -X DELETE http://localhost:5003/api/courses/6998b1cb9f7538b3b3e4287c | jq '.message'
```

**Expected Response:**
```
"Course deleted successfully"
```

---

## Test 13: Verify Deletion
```bash
curl http://localhost:5003/api/courses/6998b1cb9f7538b3b3e4287c | jq '.error'
```

**Expected Response:**
```
"Course not found"
```

---

## Complete Test Script

Save as `test_all.sh`:

```bash
#!/bin/bash

echo "🧪 RUNNING ALL API TESTS..."
echo ""

API="http://localhost:5003/api"

echo "✅ TEST 1: Health Check"
curl -s $API/health | jq .
echo ""

echo "✅ TEST 2: Get All Courses"
curl -s $API/courses | jq '.count'
echo ""

echo "✅ TEST 3: Create Without PDF (Should Fail)"
curl -s -X POST $API/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"T","category":"Banking","price":299,"authorId":"U"}' | jq '.error'
echo ""

echo "✅ TEST 4: Create With PDF & Cover"
COURSE_ID=$(curl -s -X POST $API/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test Course",
    "category":"Banking",
    "price":499,
    "authorId":"teacher_001",
    "pdfUrl":"https://example.com/sample.pdf",
    "coverUrl":"https://example.com/cover.jpg"
  }' | jq -r '.data._id')

echo "Course ID: $COURSE_ID"
echo ""

echo "✅ TEST 5: Get Single Course"
curl -s $API/courses/$COURSE_ID | jq '.data.title'
echo ""

echo "✅ TEST 6: Update Course"
curl -s -X PUT $API/courses/$COURSE_ID \
  -H "Content-Type: application/json" \
  -d '{"price": 599}' | jq '.message'
echo ""

echo "✅ TEST 7: Delete Course"
curl -s -X DELETE $API/courses/$COURSE_ID | jq '.message'
echo ""

echo "✅ TEST 8: Verify Deletion"
curl -s $API/courses/$COURSE_ID | jq '.error'
echo ""

echo "✅ ALL TESTS COMPLETE!"
```

Run with:
```bash
chmod +x test_all.sh
./test_all.sh
```

---

## Useful jq Commands

```bash
# Extract field
curl http://localhost:5003/api/courses | jq '.data[0].title'

# Pretty print
curl http://localhost:5003/api/courses | jq .

# Get count
curl http://localhost:5003/api/courses | jq '.count'

# Get array length
curl http://localhost:5003/api/courses | jq '.data | length'

# Extract multiple fields
curl http://localhost:5003/api/courses | jq '.data | map({title, price})'
```

---

## Without jq (Plain curl)

```bash
# Basic test
curl http://localhost:5003/api/health

# With pretty print (if jq not installed)
curl -s http://localhost:5003/api/health | python -m json.tool
```

---

**Last Updated:** Feb 21, 2026
