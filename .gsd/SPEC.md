# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Migrate the source of study material assets (Exam Papers, COP, and PPTs) from local/relative paths to centralized external GitHub repositories to streamline updates and reduce main repository size.

## Goals
1. Update exam paper and COP asset paths to point to the raw URL of `https://github.com/Niet-College/niet-exam-papers-data`.
2. Update PPT asset paths to point to the raw URL of `https://github.com/Niet-College/niet-ppt-data`.
3. Support proper previewing and downloading of files across the new external domains.

## Non-Goals (Out of Scope)
- UI redesign or major component changes not required for this migration.
- Modifying the Appwrite database workflows.

## Users
Students and faculty downloading or viewing the external PDF files.

## Constraints
- **CORS block for UI capabilities:** Modern browsers enforce same-origin policy on `<a download>` tags and may block `<iframe>` viewing for direct raw GitHub URLs due to `X-Frame-Options` headers or `Content-Disposition`. We might need to use a CORS proxy, jsDelivr, or Google Docs viewer for the `<iframe>` preview modal, and adjust the download approach. 

## Success Criteria
- [ ] Clicking "View" opens the PDF correctly from the new repo without being blocked.
- [ ] Clicking "Download" allows the user to download the PDF from the new repo.
