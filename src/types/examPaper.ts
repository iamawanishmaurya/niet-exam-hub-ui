// NIET Exam Hub Types

export interface ExtractedDataItem {
  subject_code: string;
  branch_code?: string;
  branch?: string;
  semester: string | number;
  year?: string;
  subject?: string;
  subject_name?: string;
  line_number?: number;
  source_file?: string;
  source_path?: string;
}

export interface AssetMappingItem {
  path: string;
  category?: string;
  semester?: string;
  subject_name?: string;
  filename: string;
  type: "cop" | "exam";
  faculty_name?: string;
}

export interface AssetMapping {
  [subjectCode: string]: AssetMappingItem[];
}

export interface NormalizedPaper {
  subject_code: string;
  subject_name: string;
  branch_code: string;
  branch: string;
  branch_normalized: string;
  semester: string; // Roman numeral: I, II, III, etc.
  year: string;
  course: string; // B.Tech, M.Tech, MBA, etc.
  type: "exam" | "cop" | "both";
  paths: AssetMappingItem[];
  path?: string; // Primary path for compatibility
  filename?: string;
  faculty_name?: string;
}

export interface FilterOptions {
  course: string; // "All" or specific course
  semester: string | null; // "I", "II", etc. or null
  subject: string; // "All" or specific subject
  type: string; // "All", "exam", "cop", "both"
  searchQuery: string;
}

export interface PaperMetadata {
  courses: string[];
  branches: string[];
  branchCodes: string[];
  semesters: string[];
  years: string[];
}

// For display purposes
export interface DisplayPaper {
  id: string;
  subject_code: string;
  subject_name: string;
  branch_code: string;
  branch: string;
  semester: string;
  year: string;
  course: string;
  type: "exam" | "cop" | "both";
  paths: AssetMappingItem[];
  primaryPath: string;
  primaryFilename: string;
  faculty_name?: string;
}
