import { useState, useEffect, useMemo } from "react";
import { NormalizedPaper, FilterOptions, PaperMetadata, ExtractedDataItem, AssetMapping, AssetMappingItem, DisplayPaper } from "@/types/examPaper";
import Fuse from "fuse.js";

// Cache for loaded data
let cachedData: {
  extractedData: ExtractedDataItem[];
  assetMapping: AssetMapping;
} | null = null;

// Async data loader with caching
const loadData = async (): Promise<{
  extractedData: ExtractedDataItem[];
  assetMapping: AssetMapping;
}> => {
  if (cachedData) {
    return cachedData;
  }

  try {
    const [extractedDataModule, assetMappingModule] = await Promise.all([
      import("@/data/extracted_data.json"),
      import("@/data/asset_mapping.json"),
    ]);

    cachedData = {
      extractedData: extractedDataModule.default as ExtractedDataItem[],
      assetMapping: assetMappingModule.default as AssetMapping,
    };

    return cachedData;
  } catch (error) {
    console.error("Error loading data files:", error);
    throw error;
  }
};

// Normalize semester format
const normalizeSemester = (sem: string | number | undefined): string => {
  if (!sem) return "";
  
  // Convert numeric to Roman
  const numToRoman: { [key: number]: string } = {
    1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII"
  };
  
  if (typeof sem === "number" || /^\d+$/.test(String(sem))) {
    return numToRoman[parseInt(String(sem))] || String(sem);
  }
  
  // Normalize variations
  const semLower = String(sem).toLowerCase().trim();
  if (semLower.includes("first") || semLower === "1" || semLower === "1st") return "I";
  if (semLower.includes("second") || semLower === "2" || semLower === "2nd") return "II";
  if (semLower.includes("third") || semLower === "3" || semLower === "3rd") return "III";
  if (semLower.includes("fourth") || semLower === "4" || semLower === "4th") return "IV";
  if (semLower === "5" || semLower === "5th") return "V";
  if (semLower === "6" || semLower === "6th") return "VI";
  if (semLower === "7" || semLower === "7th") return "VII";
  if (semLower === "8" || semLower === "8th") return "VIII";
  
  return String(sem).toUpperCase();
};

// Extract course from branch field
const extractCourse = (branch: string | undefined): string => {
  if (!branch) return "";
  if (branch.includes("B.Tech")) return "B.Tech";
  if (branch.includes("M.Tech")) return "M.Tech";
  if (branch.includes("MBA")) return "MBA";
  if (branch.includes("MCA")) return "MCA";
  if (branch.includes("BBA")) return "BBA";
  if (branch.includes("BCA")) return "BCA";
  return branch;
};

// Find asset paths by subject code
const findAssetPaths = (
  subjectCode: string,
  semester: string | null,
  mapping: AssetMapping
): AssetMappingItem[] | null => {
  if (!subjectCode) return null;
  
  // Try exact match first
  if (mapping[subjectCode]) {
    let paths = mapping[subjectCode];
    if (semester) {
      paths = paths.filter((p) => p.semester === semester);
    }
    return paths.length > 0 ? paths : mapping[subjectCode];
  }
  
  // Try normalized match (remove trailing letters)
  const normalizedCode = subjectCode.replace(/[A-Z]$/, "");
  if (normalizedCode !== subjectCode && mapping[normalizedCode]) {
    let paths = mapping[normalizedCode];
    if (semester) {
      paths = paths.filter((p) => p.semester === semester);
    }
    return paths.length > 0 ? paths : mapping[normalizedCode];
  }
  
  return null;
};

// Normalize extracted data
const normalizeExtractedData = (
  extractedData: ExtractedDataItem[],
  assetMapping: AssetMapping
): NormalizedPaper[] => {
  return extractedData.map((item) => {
    const subjectCode = item.subject_code;
    const semester = normalizeSemester(item.semester);
    
    // Find asset path(s) for this subject code
    const assetPaths = findAssetPaths(subjectCode, semester, assetMapping);
    
    // Determine type (cop or exam) based on asset paths
    let type: "exam" | "cop" | "both" = "exam"; // default
    if (assetPaths && assetPaths.length > 0) {
      const hasCop = assetPaths.some((p) => p.type === "cop");
      const hasExam = assetPaths.some((p) => p.type === "exam");
      if (hasCop && !hasExam) {
        type = "cop";
      } else if (hasCop && hasExam) {
        type = "both";
      }
    }
    
    return {
      subject_code: subjectCode,
      subject_name: item.subject || item.subject_name || subjectCode,
      branch_code: item.branch_code || "",
      branch: item.branch || "",
      branch_normalized: item.branch_code || item.branch || "",
      semester: semester,
      year: item.year || "",
      course: extractCourse(item.branch),
      type: type,
      paths: assetPaths || [],
      path: assetPaths && assetPaths.length > 0 ? assetPaths[0].path : undefined,
      filename: assetPaths && assetPaths.length > 0 ? assetPaths[0].filename : `${subjectCode}.pdf`,
    };
  });
};

// Generate metadata from extracted data
const generateMetadata = (papers: NormalizedPaper[]): PaperMetadata => {
  const courses = new Set<string>();
  const branches = new Set<string>();
  const branchCodes = new Set<string>();
  const semesters = new Set<string>();
  const years = new Set<string>();
  
  papers.forEach((paper) => {
    if (paper.course) courses.add(paper.course);
    if (paper.branch) branches.add(paper.branch);
    if (paper.branch_code) branchCodes.add(paper.branch_code);
    if (paper.semester) semesters.add(paper.semester);
    if (paper.year) years.add(paper.year);
  });
  
  return {
    courses: Array.from(courses).sort(),
    branches: Array.from(branches).sort(),
    branchCodes: Array.from(branchCodes).sort(),
    semesters: Array.from(semesters).sort((a, b) => {
      const order: { [key: string]: number } = {
        I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8
      };
      return (order[a] || 99) - (order[b] || 99);
    }),
    years: Array.from(years).sort().reverse(),
  };
};

// Parse search query for pattern matching (subject:semester)
const parseSearchQuery = (query: string): { subject: string | null; semester: string | null } | null => {
  if (!query || !query.trim()) return null;
  
  query = query.trim();
  
  if (query.includes(":")) {
    const parts = query.split(":").map((p) => p.trim());
    if (parts.length >= 2) {
      return {
        subject: parts[0] || null,
        semester: parts[1] ? normalizeSemester(parts[1]) : null,
      };
    }
  } else {
    return { subject: query, semester: null };
  }
  
  return null;
};

// Fuzzy match subject name
const fuzzyMatchSubject = (subjectName: string, query: string): boolean => {
  if (!subjectName || !query) return false;
  
  const subject = subjectName.toLowerCase().trim();
  const q = query.toLowerCase().trim();
  
  // Tokenize subject into words
  const subjectWords = subject.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const queryWords = q.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  
  // Single-word query: allow substring match
  if (queryWords.length === 1) {
    const qw = queryWords[0];
    if (subject.includes(qw)) return true;
    return subjectWords.some((sw) => sw.startsWith(qw));
  }
  
  // Multi-word query: require all words to match
  return queryWords.every((qw) => subjectWords.some((sw) => sw === qw || sw.startsWith(qw)));
};

// Convert NormalizedPaper to DisplayPaper
const toDisplayPaper = (paper: NormalizedPaper, index: number): DisplayPaper => {
  return {
    id: `${paper.subject_code}-${index}`,
    subject_code: paper.subject_code,
    subject_name: paper.subject_name,
    branch_code: paper.branch_code,
    branch: paper.branch,
    semester: paper.semester,
    year: paper.year,
    course: paper.course,
    type: paper.type,
    paths: paper.paths,
    primaryPath: paper.path || "",
    primaryFilename: paper.filename || `${paper.subject_code}.pdf`,
  };
};

export const useExamPapers = (initialFilters?: Partial<FilterOptions>) => {
  const [papers, setPapers] = useState<NormalizedPaper[]>([]);
  const [metadata, setMetadata] = useState<PaperMetadata>({
    courses: [],
    branches: [],
    branchCodes: [],
    semesters: [],
    years: [],
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    course: "All",
    semester: null,
    subject: "All",
    type: "All",
    searchQuery: "",
    ...initialFilters,
  });

  // Load data on mount (async with caching)
  useEffect(() => {
    const loadDataAsync = async () => {
      try {
        setLoading(true);
        
        // Load data asynchronously
        const { extractedData, assetMapping } = await loadData();
        
        // Normalize the data
        const normalized = normalizeExtractedData(extractedData, assetMapping);
        
        // Generate metadata
        const meta = generateMetadata(normalized);
        
        setPapers(normalized);
        setMetadata(meta);
      } catch (error) {
        console.error("Error loading exam papers:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDataAsync();
  }, []);

  // Get available subjects based on current filters
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    papers.forEach((paper) => {
      const matchesCourse = filters.course === "All" || paper.course === filters.course;
      const matchesSemester = !filters.semester || paper.semester === filters.semester;
      if (matchesCourse && matchesSemester) {
        if (paper.subject_name && paper.subject_name.trim()) {
          subjects.add(paper.subject_name.trim());
        }
      }
    });
    return Array.from(subjects).sort();
  }, [papers, filters.course, filters.semester]);

  // Get available semesters based on current filters
  const availableSemesters = useMemo(() => {
    const semesters = new Set<string>();
    papers.forEach((paper) => {
      const matchesCourse = filters.course === "All" || paper.course === filters.course;
      if (matchesCourse && paper.semester) {
        semesters.add(paper.semester);
      }
    });
    return Array.from(semesters).sort((a, b) => {
      const order: { [key: string]: number } = {
        I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8
      };
      return (order[a] || 99) - (order[b] || 99);
    });
  }, [papers, filters.course]);

  // Memoize Fuse instance for better performance - only for complex searches
  const fuseInstance = useMemo(() => {
    if (papers.length === 0) return null;
    return new Fuse(papers, {
      keys: [
        { name: "subject_name", weight: 0.6 },
        { name: "subject_code", weight: 0.4 },
      ],
      threshold: 0.5, // Higher threshold = faster search
      includeScore: false,
      minMatchCharLength: 2,
      ignoreLocation: true,
      findAllMatches: false,
      useExtendedSearch: false, // Disable extended search for speed
    });
  }, [papers]);

  // Filter papers - optimized single-pass filtering
  const filteredPapers = useMemo(() => {
    const searchQuery = filters.searchQuery.trim();
    const needsFlattening = filters.type === "All" || !filters.type;
    
    // Pre-compute filter conditions
    const courseFilter = filters.course !== "All" ? filters.course : null;
    const semesterFilter = filters.semester || null;
    const subjectFilter = filters.subject !== "All" ? filters.subject : null;
    const typeFilter = filters.type !== "All" ? filters.type : null;
    
    // Parse search query once
    const parsed = searchQuery ? parseSearchQuery(searchQuery) : null;
    const searchLower = searchQuery.toLowerCase();
    // Only use Fuse.js for queries 4+ chars that need fuzzy matching
    const useFuse = searchQuery && !parsed && searchQuery.length >= 4 && fuseInstance;
    
    // Single pass filtering - much faster than multiple filter() calls
    let result: NormalizedPaper[] = [];
    
    // For very short queries (1-2 chars), limit processing for faster response
    const maxResults = searchQuery.length <= 2 ? 100 : Infinity;
    let resultCount = 0;
    
    for (let i = 0; i < papers.length && resultCount < maxResults; i++) {
      const paper = papers[i];
      
      // Apply course filter
      if (courseFilter && paper.course !== courseFilter) continue;
      
      // Apply semester filter
      if (semesterFilter && paper.semester !== semesterFilter) continue;
      
      // Apply subject filter
      if (subjectFilter && paper.subject_name !== subjectFilter) continue;
      
      // Apply type filter
      if (typeFilter) {
        if (typeFilter === "cop" && paper.type !== "cop") continue;
        if (typeFilter === "exam" && paper.type !== "exam") continue;
        if (typeFilter === "both" && paper.type !== "both") continue;
      }
      
      // Apply search query - use fast string matching for most cases
      if (searchQuery) {
        if (parsed) {
          // Pattern-based search
          if (parsed.subject && !fuzzyMatchSubject(paper.subject_name, parsed.subject)) continue;
          if (parsed.semester && paper.semester !== parsed.semester) continue;
        } else if (!useFuse) {
          // Fast string matching for queries < 4 chars - optimized with early exit
          const subject = paper.subject_name || "";
          const code = paper.subject_code || "";
          // Check if searchLower matches at start of words for faster matching
          if (searchLower.length === 1) {
            // Single char: check first char of subject name or code
            if (subject.charAt(0).toLowerCase() !== searchLower && code.charAt(0).toLowerCase() !== searchLower) {
              // Also check if it's in the string
              if (!subject.toLowerCase().includes(searchLower) && !code.toLowerCase().includes(searchLower)) {
                continue;
              }
            }
          } else {
            // Multi-char: use includes check
            if (!subject.toLowerCase().includes(searchLower) && !code.toLowerCase().includes(searchLower)) {
              continue;
            }
          }
        }
        // If useFuse is true, we'll filter after with Fuse.js
      }
      
      result.push(paper);
      resultCount++;
    }
    
    // Apply Fuse.js search if needed (only for longer queries that need fuzzy matching)
    if (useFuse && result.length > 0 && result.length < 500) { // Limit to reasonable size for performance
      // Search on the already-filtered subset for better performance
      const searchSet = result.length > 200 ? result.slice(0, 200) : result; // Limit for speed
      const tempFuse = new Fuse(searchSet, {
        keys: [
          { name: "subject_name", weight: 0.7 },
          { name: "subject_code", weight: 0.3 },
        ],
        threshold: 0.7, // Even higher for speed
        includeScore: false,
        minMatchCharLength: 2,
        ignoreLocation: true,
        findAllMatches: false,
      });
      const searchResults = tempFuse.search(searchQuery);
      result = searchResults.map((item) => item.item);
    }
    
    // Flatten results if needed (only when type is "All")
    // Skip expensive flattening for short queries (1-2 chars) - use simplified version
    if (needsFlattening) {
      if (searchQuery.length <= 2) {
        // For short queries (1-2 chars), use simplified flattening - just use first path
        result = result.map(paper => ({
          ...paper,
          paths: paper.paths.length > 0 ? [paper.paths[0]] : paper.paths,
          path: paper.paths[0]?.path || paper.path,
          filename: paper.paths[0]?.filename || paper.filename,
          type: paper.paths[0]?.type || paper.type,
        }));
      } else {
        // Full flattening for longer queries (3+ chars)
        const flattened: NormalizedPaper[] = [];
        for (let i = 0; i < result.length; i++) {
          const paper = result[i];
          if (paper.paths && paper.paths.length > 0) {
            for (let j = 0; j < paper.paths.length; j++) {
              flattened.push({
                ...paper,
                type: paper.paths[j].type,
                paths: [paper.paths[j]],
                path: paper.paths[j].path,
                filename: paper.paths[j].filename,
              });
            }
          } else if (paper.path) {
            flattened.push(paper);
          }
        }
        result = flattened;
      }
    }

    // Convert to display papers - limit conversion for very short queries
    const displayLimit = searchQuery.length <= 2 ? 100 : Infinity;
    const papersToDisplay = displayLimit < Infinity ? result.slice(0, displayLimit) : result;
    return papersToDisplay.map((paper, index) => toDisplayPaper(paper, index));
  }, [papers, filters, fuseInstance]);

  // Get trending papers (papers with multiple files or recent years)
  const trendingPapers = useMemo(() => {
    const papersWithMultipleFiles = papers.filter((p) => p.paths.length > 1);
    const recentPapers = papers
      .filter((p) => {
        const year = parseInt(p.year.split("-")[0]);
        return year >= 2022;
      })
      .slice(0, 6);
    
    return [...papersWithMultipleFiles, ...recentPapers]
      .slice(0, 6)
      .map((paper, index) => toDisplayPaper(paper, index));
  }, [papers]);

  const clearFilters = () => {
    setFilters({
      course: "All",
      semester: null,
      subject: "All",
      type: "All",
      searchQuery: "",
    });
  };

  return {
    papers: filteredPapers,
    allPapers: papers.map((p, i) => toDisplayPaper(p, i)),
    filteredPapers,
    trendingPapers,
    filters,
    setFilters,
    clearFilters,
    metadata,
    availableSubjects,
    availableSemesters,
    loading,
  };
};
