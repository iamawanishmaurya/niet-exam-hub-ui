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

---

### Phase 11: Fix Faculty Search Filtering
**Status**: ✅ Completed
**Objective**: Fix the search filtering logic in `useExamPapers` hook so that it indexes and successfully matches against the `faculty_name` / `teacher_name` attribute. Currently clicking a faculty name yields 0 results.
**Depends on**: Phase 10

**Tasks**:
- [x] Add `faculty_name` key to Fuse.js instance
- [x] Add `faculty_name` to manual `includes()` checks

**Verification**:
- [x] `npm run build` exits 0
- [x] Clicking a faculty name returns matching PPTs

---

### Phase 12: Fix Upload Functionality Network Error
**Status**: ⬜ Not Started
**Objective**: Fix the network error encountered when uploading files on the deployed website.
**Depends on**: Phase 11

**Tasks**:
- [ ] Investigate cause of "network error" (likely missing env vars in prod build)
- [ ] Fix the deployment workflow or code to connect to the backend correctly

**Verification**:
- Upload form successfully pushes data to backend instead of throwing a network error on production.


---

### Phase 13: Fix Upload "Failed to fetch" Error
**Status**: ⬜ Not Started
**Objective**: Diagnose and fix the "failed to fetch" error during file upload on the live site.
**Depends on**: Phase 12

**Tasks**:
- [ ] Examine console logs on the live upload page
- [ ] Identify if it's missing CORS, a browser privacy issue, or a missing Appwrite host setting
- [ ] Implement fix and verify upload completes successfully.

**Verification**:
- Upload a file and verify it succeeds without "Failed to fetch".


---

### Phase 14: Add Upload Progress Bar
**Status**: ⬜ Not Started
**Objective**: Display a progress bar reflecting the file upload progress for both single and bulk uploads.
**Depends on**: Phase 13

**Tasks**:
- [ ] Update `Upload.tsx` to track file upload progress from Appwrite storage.
- [ ] Add a UI progress bar component that updates in real-time.
- [ ] Handle progress for bulk upload across multiple files.

**Verification**:
- Users can see a smooth progress bar advancing as files are uploaded.


---

### Phase 15: Documentation, UI Links, and Dual Deploy
**Status**: ⬜ Not Started
**Objective**: Implement documentation updates, fix tracking/ignore configurations for both repos, update the About page UI, and push correctly to both remotes.
**Depends on**: Phase 14

**Tasks**:
- [ ] Ensure `.github/workflows` and `.gsd` are correctly ignored or tracked on the `nietcollege` remote.
- [ ] Update README.md with comprehensive project details.
- [ ] Create detailed Wiki pages for the project (using a Wiki repository or structured markdown).
- [ ] Add a link/button to the GitHub Niet-College profile in the About section.
- [ ] Push updates to both `origin` (iamawanishmaurya) and `nietcollege` (Niet-College) remotes.

**Verification**:
- Repositories reflect the correct tracked/ignored files.
- README and About page look populated.
- Both remotes are synced.


---

### Phase 16: Populate GitHub Wiki
**Status**: ⬜ Not Started
**Objective**: Upload the locally generated documentation files to the GitHub Wiki.
**Depends on**: Phase 15

**Tasks**:
- [ ] Use browser subagent to navigate to the GitHub Wiki
- [ ] Create the Home page and upload Architecture, Appwrite-Setup, and Deployment pages.
- [ ] Verify pages are live.

**Verification**:
- Users can view the wiki at https://github.com/Niet-College/niet-exam-hub-ui/wiki


---

### Phase 17: Fix Blank Page on Niet-College GitHub Pages Deploy
**Status**: ⬜ Not Started
**Objective**: Diagnose and fix the blank white screen appearing on the `nietcollege` GitHub Pages deployment.
**Depends on**: Phase 16

**Tasks**:
- [ ] Use browser subagent to verify the blank screen and check console errors.
- [ ] Identify if the issue is a missing Vite `base` path, incorrect React Router `basename`, or an unbuilt `index.html`.
- [ ] Fix the issue so it deploys correctly on the subdirectory `/niet-exam-hub-ui/` without breaking the personal repo's custom domain.

**Verification**:
- Both the domain `nietexamhub.bugmein.me` and the GH Pages url `niet-college.github.io/niet-exam-hub-ui/` load the app successfully.


---

### Phase 18: UI Adjustments for About and Theme Toggle
**Status**: ⬜ Not Started
**Objective**: Separate the Niet-College link from Collaborators in the About page as it represents the project, and simplify the theme toggle to switch directly between light and dark modes on click instead of using a dropdown.
**Depends on**: Phase 17

**Tasks**:
- [ ] Update `About.tsx` to give Niet-College its own 'Project' section.
- [ ] Update `ThemeToggle.tsx` to be a simple button that toggles between light and dark.
- [ ] Push changes.

**Verification**:
- Theme toggle works in one click.
- About page layout is correct.


---

### Phase 19: Add Visitor Counter and Upload Feedback
**Status**: ⬜ Not Started
**Objective**: Implement a visitor counter badge in the About section and update the upload success message to inform users about the contributors list.
**Depends on**: Phase 18

**Tasks**:
- [ ] Update `Upload.tsx` to show a custom toast message after successful upload mentioning the contributors section in the About page.
- [ ] Add a visitor counter badge (e.g., using a third-party badge service like hits.seeyoufarm.com or counter.dev) to `About.tsx`.
- [ ] Push changes to `origin` (and manually deploy to `nietcollege` if necessary).

**Verification**:
- Successful upload shows the new toast message.
- About page displays a visitor counter.


---

### Phase 20: Fix Logo and Move Visitor Counter
**Status**: ⬜ Not Started
**Objective**: Fix the broken NIET logo in the header and reposition the visitor counter to be more prominent at the top of the About page.
**Depends on**: Phase 19

**Tasks**:
- [ ] Fix logo image path in `Header.tsx`.
- [ ] Move visitor counter badge in `About.tsx` from the footer to a higher section.
- [ ] Push changes and deploy to `nietcollege`.

**Verification**:
- Header logo displays correctly.
- Visitor counter is clearly visible near the top of the About page.


---

### Phase 21: Replace Dead Visitor Counter
**Status**: ⬜ Not Started
**Objective**: Replace the dead hits.seeyoufarm.com visitor counter with a working alternative (like api.visitorbadge.io) and ensure it is properly placed above.
**Depends on**: Phase 20

**Tasks**:
- [ ] Replace the hits.seeyoufarm URL with a working visitor badge service in `About.tsx`.
- [ ] Push changes and deploy to `nietcollege`.

**Verification**:
- Visitor counter loads correctly without SSL errors.

