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
**Status**: ⬜ Planned
**Objective**: Fix duplicate branch/course tags in PPT display (e.g. replacing redundant "B.Tech" tags with unit/year), and fix the faculty name metadata mapping so it displays correctly.
**Depends on**: Phase 6

**Tasks**:
- [ ] Implement `7-PLAN.md` (Update types, hook mapping, and badge rendering logic)

**Verification**:
- UI tests running `/ppt/search` to verify visually correct tags and metadata.
