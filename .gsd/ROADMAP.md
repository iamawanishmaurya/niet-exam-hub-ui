# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] External URLs for Exam and COP papers
- [ ] External URLs for PPTs
- [ ] Functioning PDF Preview across domains
- [ ] Functioning Download across domains

## Phases

### Phase 1: URL Reconstruction Logic
**Status**: ⬜ Not Started
**Objective**: Dynamically prepend external GitHub raw or proxy URLs to the relative asset paths returned from `asset_mapping.json` and `ppt_asset_mapping.json`.

### Phase 2: Fix Downloader and Previewer
**Status**: ⬜ Not Started
**Objective**: Overcome cross-origin restrictions for `PdfPreviewModal.tsx` and `PaperCard.tsx` (using URL fetching for blobs if possible, or public proxy like Google Docs Viewer for `<iframe/>`).

---

### Phase 3: Remove Local PDF Files
**Status**: ⬜ Completed
**Objective**: Remove the local PDF files from the repository to reduce the project footprint, as they are now being served dynamically from GitHub.
**Depends on**: Phase 2

**Tasks**:
- [x] Deleted `assets/` and `public/pptx/` folders

**Verification**:
- Local size reduced

---

### Phase 4: Fix PDF Preview
**Status**: ⬜ Completed
**Objective**: Resolve the issue where the PDF preview shows "No preview option available." We need an alternative to the Google Docs Viewer Proxy or a better way to display files from `raw.githubusercontent.com`.
**Depends on**: Phase 2

**Tasks**:
- [x] Converted iframe src to use Blob URLs
- [x] Adopted Modal to Object URL Download

**Verification**:
- Previews and downloads work natively.

---

### Phase 5: Fix 404 Not Found on PDFs
**Status**: ⬜ Completed
**Objective**: Fix the `404: Not Found` error when attempting to preview or download PDFs. This indicates the reconstructed GitHub raw URLs are slightly incorrect (e.g., missing a folder path like `assets/` or incorrect branch/repo).
**Depends on**: Phase 4

**Tasks**:
- [x] Repaired prefix URLs from asset map logic

**Verification**:
- Previews and downloads work

---

### Phase 6: Assorted UI and Content Fixes
**Status**: ✅ Completed
**Objective**: Fix the preview modal action, reorder the navigation bar, and fix missing faculty name metadata.
**Depends on**: Phase 5

**Tasks**:
- [x] Fixed PdfPreviewModal description — replaced raw URL with friendly text
- [x] Reordered Header nav: Home → Papers → About → Bulk → Upload
- [x] Added optional `faculty_name` field to types and PaperCard badge

**Verification**:
- [x] `npm run build` exits 0 (both waves)

---

### Phase 7: PPT Metadata and Faculty Extraction Fixes
**Status**: ✅ Completed
**Objective**: Fix duplicate branch/course tags in PPT display (e.g. replacing redundant "B.Tech" tags with unit/year), and fix the faculty name metadata mapping so it displays correctly.
**Depends on**: Phase 6

**Tasks**:
- [x] Implement `7-PLAN.md` (Update types, hook mapping, and badge rendering logic)

**Verification**:
- [x] UI logic written to conditionally hide unknown/redundant tags
- [x] Build passing (`npm run build` exits 0)

---

### Phase 8: Deep PDF Analysis & Faculty Data Extraction
**Status**: ✅ Completed
**Objective**: Clone the `niet-ppt-data` repository and perform deep analysis on the first 5 pages of the raw PPT/PDF files to extract real faculty names, teachers, and department names. Then generate an updated `ppt_asset_mapping.json` using the newly discovered metadata.
**Depends on**: Phase 7

**Tasks**:
- [x] Implement `/plan 8` python extraction loop using PyMuPDF

**Verification**:
- [x] Run python scripts against PDFs to verify extraction accuracy
- [x] Run `npm run build` after pushing the data objects into the codebase

---

### Phase 9: UI Redesign for Faculty Names
**Status**: ✅ Completed
**Objective**: Redesign `PaperCard.tsx` so that `faculty_name` is no longer rendered as a generic badge/tag, but rather displayed more prominently as authorship (e.g., "By: Dr. X") alongside or under the subject name.
**Depends on**: Phase 8

**Tasks**:
- [x] Implement `9-PLAN.md` (Modify `PaperCard.tsx` JSX structure)

**Verification**:
- [x] Validate visually by testing `/ppt/search` route locally

---

### Phase 10: Clickable Faculty Name Search
**Status**: ✅ Completed
**Objective**: Make the `faculty_name` inside `PaperCard` clickable so that it re-filters the current search view to show all papers by that specific teacher. It should be colored sky blue.
**Depends on**: Phase 9

**Tasks**:
- [x] Update `PaperCard.tsx` styling and `onClick` handler
- [x] Update `Papers.tsx` search param synchronisation

**Verification**:
- [x] `npm run build` passes locally

