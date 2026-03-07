# How to Extract PDF & Image Data in Postman

## 📥 Getting PDF Details from API Response

### Method 1: View in Postman

**After GET /api/courses/1 request:**

1. Click **Response** tab
2. Look for `data.pdf` field
3. You'll see base64 encoded string: `data:application/pdf;base64,JVBERi0xLjQK...`

### Method 2: Save Base64 Data

**In Postman:**
1. Click on response
2. Find `pdf` field
3. Right-click → Copy value
4. Save to a text file for processing

---

## 🔄 Converting Base64 to PDF File

### In Terminal (macOS):

```bash
# After copying base64 string (without "data:application/pdf;base64," prefix)
echo "BASE64_STRING_HERE" | base64 -d > course.pdf

# Example with a real string (first 100 chars):
echo "JVBERi0xLjQKJeLjz9M..." | base64 -d > course.pdf
```

### In Python:

```python
import base64

# Get base64 string from API response
base64_string = "JVBERi0xLjQKJeLjz9M..."

# Decode to bytes
pdf_bytes = base64.b64decode(base64_string)

# Write to file
with open('course.pdf', 'wb') as f:
    f.write(pdf_bytes)

print("✅ PDF saved as course.pdf")
```

### In Node.js:

```javascript
const fs = require('fs');

// Get base64 string from API response
const base64String = "JVBERi0xLjQKJeLjz9M...";

// Convert to buffer
const pdfBuffer = Buffer.from(base64String, 'base64');

// Write to file
fs.writeFileSync('course.pdf', pdfBuffer);

console.log('✅ PDF saved as course.pdf');
```

### In JavaScript (Browser):

```javascript
// From API response
const course = response.data;

// Create blob from base64
const byteCharacters = atob(course.pdf.split(',')[1]); // Remove prefix
const byteNumbers = new Array(byteCharacters.length);
for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
}
const byteArray = new Uint8Array(byteNumbers);
const blob = new Blob([byteArray], { type: 'application/pdf' });

// Create download link
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'course.pdf';
link.click();
```

---

## 🖼️ Extracting Image from Response

### Similar Steps for Cover Image

**Base64 string format:**
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
```

### Save Image in Terminal:

```bash
# For JPEG
echo "BASE64_STRING" | base64 -d > course_cover.jpg

# For PNG
echo "BASE64_STRING" | base64 -d > course_cover.png
```

### In JavaScript:

```javascript
const course = response.data;

// Create download link for cover
const link = document.createElement('a');
link.href = course.cover; // Already has "data:image/jpeg;base64," prefix
link.download = 'course-cover.jpg';
link.click();
```

---

## 📊 Verify PDF Content in Postman

### Check PDF Validity

**Decoded PDF should start with:**
```
%PDF-1.4
```

**Check in Postman:**
1. Get response
2. Copy `pdf` value
3. Remove `data:application/pdf;base64,` prefix
4. First characters should decode to `%PDF-1.4`

### Check Image Validity

**JPEG should start with:**
```
ÿØÿà
```

**PNG should start with:**
```
‰PNG
```

---

## 🎯 Complete Example: Get PDF Details

### Postman Request:

```
GET http://localhost:5003/api/courses/1
```

### Response Structure:

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "SBI PO Complete Guide",
    "price": 299,
    "pdf": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9M/VW5pY29kZS9JREB...",
    "cover": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "description": "...",
    "students": 45,
    "rating": 4.5
  }
}
```

### Extract PDF Details:

```python
import json
import requests
import base64

# Get course from API
response = requests.get('http://localhost:5003/api/courses/1')
course = response.json()['data']

# Extract PDF info
pdf_data = course['pdf']
print(f"PDF Field: {pdf_data[:50]}...")  # First 50 chars

# Extract base64 part
pdf_base64 = pdf_data.split('base64,')[1]
print(f"Base64 Length: {len(pdf_base64)} chars")

# Decode to bytes
pdf_bytes = base64.b64decode(pdf_base64)
print(f"PDF Size: {len(pdf_bytes)} bytes ({len(pdf_bytes)/1024/1024:.2f} MB)")

# Verify it's PDF
if pdf_bytes[:4] == b'%PDF':
    print("✅ Valid PDF file")
else:
    print("❌ Invalid PDF file")

# Save to file
with open('downloaded_course.pdf', 'wb') as f:
    f.write(pdf_bytes)
    print("✅ Saved to downloaded_course.pdf")
```

---

## 📋 Response Data Explanation

### PDF Field Structure:

```
┌─────────────────┬──────────┬──────────────────────┐
│ Prefix          │ Encoding │ Base64 Encoded Data  │
├─────────────────┼──────────┼──────────────────────┤
│ data:           │ base64   │ JVBERi0xLjQKJeLj...  │
│ application/pdf │          │ (very long string)   │
│ ;               │          │                      │
└─────────────────┴──────────┴──────────────────────┘
```

### Example Response:

```json
{
  "success": true,
  "count": 1,
  "data": {
    "id": "1",
    "title": "SBI PO Complete Guide",
    "category": "Banking",
    "subcategory": "SBI PO",
    "price": 299,
    "author": "Admin",
    "authorId": "default",
    "pages": 450,
    "description": "Comprehensive guide to crack SBI PO exam",
    "features": [
      "Complete Syllabus",
      "Mock Tests",
      "Expert Tips"
    ],
    "pdf": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9M/VW5pY29kZS9JREY...",
    "cover": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQ...",
    "rating": 4.5,
    "reviews": 12,
    "students": 45,
    "downloads": 78,
    "image": "📚",
    "isActive": true,
    "createdAt": "2026-02-20T18:38:45.264Z"
  }
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Download PDF from API

```javascript
// In your frontend app
async function downloadCoursePDF(courseId) {
    try {
        // Get course data
        const response = await fetch(`http://localhost:5003/api/courses/${courseId}`);
        const course = response.json().data;
        
        // Create link from base64
        const link = document.createElement('a');
        link.href = course.pdf; // Already in correct format
        link.download = `${course.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ PDF downloaded');
    } catch (error) {
        console.error('❌ Download failed:', error);
    }
}
```

### Scenario 2: Display PDF Preview

```html
<!-- Embed PDF in iframe -->
<iframe id="pdf-viewer" width="100%" height="600"></iframe>

<script>
async function showPDFPreview(courseId) {
    const response = await fetch(`http://localhost:5003/api/courses/${courseId}`);
    const course = response.json().data;
    
    document.getElementById('pdf-viewer').src = course.pdf;
}
</script>
```

### Scenario 3: Upload & Verify

```javascript
// After uploading
async function uploadAndVerify() {
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('cover', coverFile);
    
    // Upload
    const uploadRes = await fetch('http://localhost:5003/api/courses/upload', {
        method: 'POST',
        body: formData
    });
    const uploadData = uploadRes.json();
    
    // Verify
    console.log('PDF Base64 Length:', uploadData.data.pdf.buffer.length);
    console.log('Cover Base64 Length:', uploadData.data.cover.buffer.length);
    
    // Use in course creation
    const courseData = {
        title: 'My Course',
        category: 'Banking',
        price: 499,
        authorId: 'user_123',
        pdf: `data:application/pdf;base64,${uploadData.data.pdf.buffer}`,
        cover: `data:image/jpeg;base64,${uploadData.data.cover.buffer}`
    };
    
    const createRes = await fetch('http://localhost:5003/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
    });
    
    console.log('✅ Course created with files');
}
```

---

## 📝 Postman Script to Save Files

**In Postman → Tests tab:**

```javascript
// After GET /api/courses/1 response
const response = pm.response.json();
const course = response.data;

// Store for later use
pm.collectionVariables.set('course_pdf_base64', course.pdf);
pm.collectionVariables.set('course_cover_base64', course.cover);
pm.collectionVariables.set('course_title', course.title);

console.log('✅ Course data saved to variables');
```

---

## 🔍 Debugging PDF Issues

### PDF not showing?

1. **Check base64 starts with:** `JVBERi0x` (valid PDF header)
2. **Verify prefix:** Must include `data:application/pdf;base64,`
3. **Check length:** Should be much longer than original file size

### Image not showing?

1. **Check JPEG starts with:** `/9j/4AAQ` 
2. **Check PNG starts with:** `iVBORw0KGgo`
3. **Verify prefix:** `data:image/jpeg;base64,` or `data:image/png;base64,`

### File too large?

- Multer limit is 50MB
- Split large files into chunks if needed
- Or stream directly from storage

---

## 💾 Store & Retrieve from Database

When integrating with MongoDB:

```javascript
// Save PDF as file reference (recommended)
{
  title: 'SBI PO',
  pdfPath: 'uploads/pdf/course_1.pdf',
  pdfSize: 2500000,
  coverPath: 'uploads/images/course_1.jpg'
}

// Instead of storing full base64 in DB
// Store in filesystem → reference in DB
```

This keeps database lightweight and PDFs accessible via static file serving.
