# NIET Exam Hub

A comprehensive web-based platform for searching, viewing, and downloading NIET (Noida Institute of Engineering and Technology) exam papers and study materials.

## 🌐 Live Website

**GitHub Pages:** https://iamawanishmaurya.github.io/nietexamhub/

## 📋 Overview

NIET Exam Hub is a static web application that provides students with easy access to:
- **Exam Papers** - Regular semester exam papers organized by semester and subject
- **COP Papers** - Carry-over papers for supplementary examinations
- **Search & Filter** - Advanced search capabilities with multiple filter options
- **Quick Download** - Direct download and view options for all PDFs

## 📁 Folder Structure

```
exam_hub/
├── index.html                  # Main web interface (PDF downloader)
├── pdf_downloader.html         # Alternative entry point
├── README.md                   # This file
│
├── assets/                     # All PDF files organized by type and semester
│   ├── cop/                    # Carry-over papers
│   │   ├── Semester I/
│   │   │   ├── Subject Name 1/
│   │   │   │   └── [PDF files]
│   │   │   └── Subject Name 2/
│   │   │       └── [PDF files]
│   │   ├── Semester II/
│   │   ├── Semester III/
│   │   ├── Semester IV/
│   │   ├── Semester V/
│   │   └── Semester VI/
│   │
│   └── exam/                   # Regular exam papers
│       ├── Semester I/
│       │   ├── Subject Name 1/
│       │   │   └── [PDF files]
│       │   └── Subject Name 2/
│       │       └── [PDF files]
│       ├── Semester II/
│       ├── Semester III/
│       ├── Semester IV/
│       ├── Semester V/
│       └── Semester VI/
│
└── Data Files/                 # Metadata and mapping files
    ├── extracted_data.json     # Complete metadata for all papers
    ├── extracted_data.csv      # CSV version of metadata
    ├── asset_mapping.json      # Maps subject codes to file paths
    └── pdf_index_enhanced.json # Enhanced PDF index (legacy)
```

## 🎯 Features

### Current Features

- ✅ **Advanced Search**
  - Quick search with pattern matching (`subject:semester:year:branch`)
  - Fuzzy matching for subject names
  - Real-time search results

- ✅ **Multi-Level Filtering**
  - Course filter (B.Tech, M.Tech, MBA, etc.)
  - Semester filter (I-VI)
  - Subject name filter
  - Type filter (Normal, COP, Exam)

- ✅ **PDF Management**
  - View PDFs in new tab
  - Download individual files
  - Bulk download for filtered results
  - Multiple file support per subject

- ✅ **Responsive Design**
  - Mobile-friendly interface
  - Modern UI with Bootstrap 5
  - Grid and list view options

- ✅ **Data Organization**
  - 1,264+ exam papers organized
  - 6 semesters × 2 types (COP/Exam)
  - Subject-based folder structure

## 🚀 Setup & Deployment

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamawanishmaurya/nietexamhub.git
   cd nietexamhub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:8080
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

### GitHub Pages Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist/` folder
3. Configure GitHub Pages to serve from the `dist/` folder or deploy the `dist/` contents to the root
4. Go to **Settings → Pages** in your GitHub repository
5. Source: `Deploy from a branch`
6. Branch: `main`, Folder: `/dist` (or root if you copy dist contents)
7. Site will be available at: `https://iamawanishmaurya.github.io/nietexamhub/`

## 📊 Data Files

### `extracted_data.json`
Contains metadata for all exam papers:
- Subject code
- Subject name
- Semester (I-VI)
- Academic year
- Course (B.Tech, M.Tech, etc.)
- Branch and branch code
- Type (COP, Exam, Normal)

### `asset_mapping.json`
Maps subject codes to their file paths:
```json
{
  "ACSCY0401": [
    {
      "path": "assets/cop/Semester IV/Computer Networks/ACSCY0401.pdf",
      "type": "cop",
      "filename": "ACSCY0401.pdf"
    }
  ]
}
```

## 🔍 Search Patterns

The quick search supports flexible patterns:

- `dsa` - Search for "dsa" in any field
- `dsa:3` - Data Structures in 3rd semester
- `dsa:3:2023` - Data Structures, 3rd semester, year 2023
- `cyber security:3:2023:cy` - Cyber Security, 3rd sem, 2023, CY branch
- `cyber security` - All papers from Cyber Security branch

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript
- **UI Framework:** Tailwind CSS, shadcn/ui components
- **Build Tool:** Vite
- **Routing:** React Router
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Hosting:** GitHub Pages
- **Data Format:** JSON, CSV

## 📝 Future Enhancements

### Phase 1: Study Materials (PPT/PPTX) Integration

- [ ] **PPT/PPTX Support**
  - [ ] Add PPT/PPTX file viewer (convert to PDF on-the-fly or use viewer)
  - [ ] Organize study materials by semester/subject/unit
  - [ ] Extract metadata from PPT files (subject, unit, semester, teacher)
  - [ ] Add study materials section to main interface
  - [ ] Create separate filter for study materials vs exam papers

- [ ] **Study Material Organization**
  - [ ] Create `assets/study-materials/` folder structure
  - [ ] Organize by: `Semester X/Subject Name/Unit Y/`
  - [ ] Generate mapping file for study materials
  - [ ] Update `asset_mapping.json` to include study materials

### Phase 2: File Upload System

- [ ] **Upload Interface**
  - [ ] Create upload page (`upload.html`)
  - [ ] Support multiple file formats (PDF, PPT, PPTX)
  - [ ] Drag-and-drop file upload
  - [ ] Progress indicator for uploads
  - [ ] File validation (size, format, content)

- [ ] **Backend Processing** (if using server)
  - [ ] File upload API endpoint
  - [ ] Automatic metadata extraction
  - [ ] File organization into correct folders
  - [ ] Update JSON data files automatically
  - [ ] Email notification for successful uploads

- [ ] **Client-Side Processing** (if staying static)
  - [ ] Use GitHub API for file uploads (via GitHub Actions)
  - [ ] Manual upload workflow with instructions
  - [ ] Template for adding new entries to JSON files

### Phase 3: Enhanced Features

- [ ] **User Features**
  - [ ] User authentication (optional)
  - [ ] Favorite papers/bookmarks
  - [ ] Download history
  - [ ] Search history
  - [ ] User contributions tracking

- [ ] **Advanced Search**
  - [ ] Full-text search within PDFs
  - [ ] Search by teacher name
  - [ ] Search by academic year range
  - [ ] Advanced filter combinations
  - [ ] Saved search queries

- [ ] **Analytics & Insights**
  - [ ] Most downloaded papers
  - [ ] Popular subjects by semester
  - [ ] Download statistics
  - [ ] User activity tracking

- [ ] **Content Management**
  - [ ] Admin panel for content management
  - [ ] Bulk file upload
  - [ ] Metadata editing interface
  - [ ] File organization tools
  - [ ] Duplicate detection and removal

### Phase 4: Mobile App (Future)

- [ ] Native mobile app (React Native / Flutter)
- [ ] Offline download support
- [ ] Push notifications for new papers
- [ ] Mobile-optimized viewing experience

## 🔧 Maintenance

### Adding New Papers

1. Place PDF files in appropriate folder:
   ```
   assets/{cop|exam}/Semester {I-VI}/{Subject Name}/{filename}.pdf
   ```

2. Update `extracted_data.json` with new entry:
   ```json
   {
     "subject_code": "ACSCY0401",
     "subject_name": "Computer Networks",
     "semester": "IV",
     "year": "2023-2024",
     "course": "B.Tech",
     "branch": "Cyber Security",
     "branch_code": "CY",
     "type": "exam"
   }
   ```

3. Update `asset_mapping.json`:
   ```json
   {
     "ACSCY0401": [
       {
         "path": "assets/exam/Semester IV/Computer Networks/ACSCY0401.pdf",
         "type": "exam",
         "filename": "ACSCY0401.pdf"
       }
     ]
   }
   ```

4. Commit and push changes:
   ```bash
   git add .
   git commit -m "Add new exam papers"
   git push
   ```

### Regenerating Asset Mapping

If you need to regenerate `asset_mapping.json`:

```bash
cd /path/to/niet_exam_hub2
python3 generate_asset_mapping.py
cp asset_mapping.json /path/to/exam_hub/
```

## 📄 License

This project is for educational purposes at NIET.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [Your Contact Information]

## 📈 Statistics

- **Total Exam Papers:** 1,264+ PDFs
- **Semesters Covered:** I, II, III, IV, V, VI
- **Paper Types:** COP (Carry-over) and Regular Exam papers
- **Subjects:** 100+ different subjects
- **Branches:** Multiple branches (CSE, CY, EC, ME, etc.)

---

**Last Updated:** November 2025 
**Project Status:** Active Development  
**Version:** 1.0.0
