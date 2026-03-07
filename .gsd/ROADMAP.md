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
**Status**: ⬜ Not Started
**Objective**: Remove the local PDF files from the repository to reduce the project footprint, as they are now being served dynamically from GitHub.
**Depends on**: Phase 2

**Tasks**:
- [ ] TBD (run /plan 3 to create)

**Verification**:
- TBD

