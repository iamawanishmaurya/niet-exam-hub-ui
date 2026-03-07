import { useState, useEffect, useMemo } from "react";
import {
  NormalizedPaper,
  FilterOptions,
  PaperMetadata,
  ExtractedDataItem,
  AssetMapping,
  AssetMappingItem,
  DisplayPaper,
} from "@/types/examPaper";
import Fuse from "fuse.js";
import { useMode, type Mode } from "@/contexts/ModeContext";

// Per-mode data cache
const cache: { exam: typeof loadedShape | null; ppt: typeof loadedShape | null } = {
  exam: null,
  ppt: null,
};

const loadedShape = {
  extractedData: [] as ExtractedDataItem[],
  assetMapping: {} as AssetMapping,
};

const loadData = async (mode: Mode) => {
  if (cache[mode]) return cache[mode]!;

  const [extractedDataModule, assetMappingModule] = await Promise.all([
    mode === "exam"
      ? import("@/data/extracted_data.json")
      : import("@/data/ppt_data.json"),
    mode === "exam"
      ? import("@/data/asset_mapping.json")
      : import("@/data/ppt_asset_mapping.json"),
  ]);

  cache[mode] = {
    extractedData: extractedDataModule.default as ExtractedDataItem[],
    assetMapping: assetMappingModule.default as AssetMapping,
  };
  return cache[mode]!;
};

const normalizeSemester = (sem: string | number | undefined): string => {
  if (!sem) return "";
  const numToRoman: { [key: number]: string } = {
    1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII",
  };
  if (typeof sem === "number" || /^\d+$/.test(String(sem))) {
    return numToRoman[parseInt(String(sem))] || String(sem);
  }
  const s = String(sem).toLowerCase().trim();
  if (s.includes("first") || s === "1" || s === "1st") return "I";
  if (s.includes("second") || s === "2" || s === "2nd") return "II";
  if (s.includes("third") || s === "3" || s === "3rd") return "III";
  if (s.includes("fourth") || s === "4" || s === "4th") return "IV";
  if (s === "5" || s === "5th") return "V";
  if (s === "6" || s === "6th") return "VI";
  if (s === "7" || s === "7th") return "VII";
  if (s === "8" || s === "8th") return "VIII";
  return String(sem).toUpperCase();
};

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

const findAssetPaths = (
  subjectCode: string,
  semester: string | null,
  mapping: AssetMapping
): AssetMappingItem[] | null => {
  if (!subjectCode) return null;
  if (mapping[subjectCode]) {
    let paths = mapping[subjectCode];
    if (semester) paths = paths.filter((p) => p.semester === semester);
    return paths.length > 0 ? paths : mapping[subjectCode];
  }
  const normalized = subjectCode.replace(/[A-Z]$/, "");
  if (normalized !== subjectCode && mapping[normalized]) {
    let paths = mapping[normalized];
    if (semester) paths = paths.filter((p) => p.semester === semester);
    return paths.length > 0 ? paths : mapping[normalized];
  }
  return null;
};

const normalizeExtractedData = (
  extractedData: ExtractedDataItem[],
  assetMapping: AssetMapping,
  mode: Mode
): NormalizedPaper[] =>
  extractedData.map((item) => {
    const subjectCode = item.subject_code;
    const semester = normalizeSemester(item.semester);
    const assetPaths = findAssetPaths(subjectCode, semester, assetMapping);
    let type: "exam" | "cop" | "both" = mode === "ppt" ? "exam" : "exam";
    if (assetPaths && assetPaths.length > 0 && mode === "exam") {
      const hasCop = assetPaths.some((p) => p.type === "cop");
      const hasExam = assetPaths.some((p) => p.type === "exam");
      if (hasCop && !hasExam) type = "cop";
      else if (hasCop && hasExam) type = "both";
    }

    const baseUrl = mode === "exam"
      ? "https://raw.githubusercontent.com/Niet-College/niet-exam-papers-data/main/"
      : "https://raw.githubusercontent.com/Niet-College/niet-ppt-data/main/";

    const processedPaths = assetPaths?.map(p => {
      let cleanPath = p.path;
      // Strip leading slashes
      if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.slice(1);
      }

      // Strip the legacy 'assets/' prefix if it's there
      if (mode === "exam" && cleanPath.startsWith('assets/')) {
        cleanPath = cleanPath.slice('assets/'.length);
      }

      // Strip the legacy 'pptx/Ppt/' prefix if it's there
      if (mode === "ppt" && cleanPath.startsWith('pptx/Ppt/')) {
        cleanPath = cleanPath.slice('pptx/Ppt/'.length);
      }

      return {
        ...p,
        path: `${baseUrl}${cleanPath}`
      };
    }) || [];

    return {
      subject_code: subjectCode,
      subject_name: item.subject || item.subject_name || subjectCode,
      branch_code: item.branch_code || "",
      branch: item.branch || "",
      branch_normalized: item.branch_code || item.branch || "",
      semester,
      year: item.year || "",
      course: extractCourse(item.branch),
      type,
      paths: processedPaths,
      path: processedPaths.length > 0 ? processedPaths[0].path : undefined,
      filename: processedPaths.length > 0 ? processedPaths[0].filename : `${subjectCode}.pdf`,
    };
  });

const generateMetadata = (papers: NormalizedPaper[]): PaperMetadata => {
  const courses = new Set<string>();
  const branches = new Set<string>();
  const branchCodes = new Set<string>();
  const semesters = new Set<string>();
  const years = new Set<string>();
  papers.forEach((p) => {
    if (p.course) courses.add(p.course);
    if (p.branch) branches.add(p.branch);
    if (p.branch_code) branchCodes.add(p.branch_code);
    if (p.semester) semesters.add(p.semester);
    if (p.year) years.add(p.year);
  });
  return {
    courses: Array.from(courses).sort(),
    branches: Array.from(branches).sort(),
    branchCodes: Array.from(branchCodes).sort(),
    semesters: Array.from(semesters).sort((a, b) => {
      const order: { [key: string]: number } = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
      return (order[a] || 99) - (order[b] || 99);
    }),
    years: Array.from(years).sort().reverse(),
  };
};

const parseSearchQuery = (query: string) => {
  if (!query?.trim()) return null;
  query = query.trim();
  if (query.includes(":")) {
    const parts = query.split(":").map((p) => p.trim());
    if (parts.length >= 2) return { subject: parts[0] || null, semester: parts[1] ? normalizeSemester(parts[1]) : null };
  }
  return { subject: query, semester: null };
};

const fuzzyMatchSubject = (subjectName: string, query: string): boolean => {
  if (!subjectName || !query) return false;
  const subject = subjectName.toLowerCase().trim();
  const q = query.toLowerCase().trim();
  const subjectWords = subject.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const queryWords = q.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  if (queryWords.length === 1) {
    const qw = queryWords[0];
    if (subject.includes(qw)) return true;
    return subjectWords.some((sw) => sw.startsWith(qw));
  }
  return queryWords.every((qw) => subjectWords.some((sw) => sw === qw || sw.startsWith(qw)));
};

const toDisplayPaper = (paper: NormalizedPaper, index: number): DisplayPaper => ({
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
});

export const useExamPapers = (initialFilters?: Partial<FilterOptions>) => {
  const { mode } = useMode();
  const [papers, setPapers] = useState<NormalizedPaper[]>([]);
  const [metadata, setMetadata] = useState<PaperMetadata>({ courses: [], branches: [], branchCodes: [], semesters: [], years: [] });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    course: "All", semester: null, subject: "All", type: "All", searchQuery: "", ...initialFilters,
  });

  // Reset papers and filters when mode changes
  useEffect(() => {
    setPapers([]);
    setFilters({ course: "All", semester: null, subject: "All", type: "All", searchQuery: "" });
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const { extractedData, assetMapping } = await loadData(mode);
        const normalized = normalizeExtractedData(extractedData, assetMapping, mode);
        const meta = generateMetadata(normalized);
        if (!cancelled) {
          setPapers(normalized);
          setMetadata(meta);
        }
      } catch (e) {
        console.error("Error loading data:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [mode]);

  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    papers.forEach((p) => {
      if ((filters.course === "All" || p.course === filters.course) && (!filters.semester || p.semester === filters.semester)) {
        if (p.subject_name?.trim()) subjects.add(p.subject_name.trim());
      }
    });
    return Array.from(subjects).sort();
  }, [papers, filters.course, filters.semester]);

  const availableSemesters = useMemo(() => {
    const sems = new Set<string>();
    papers.forEach((p) => {
      if ((filters.course === "All" || p.course === filters.course) && p.semester) sems.add(p.semester);
    });
    return Array.from(sems).sort((a, b) => {
      const o: { [k: string]: number } = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
      return (o[a] || 99) - (o[b] || 99);
    });
  }, [papers, filters.course]);

  const fuseInstance = useMemo(() => {
    if (papers.length === 0) return null;
    return new Fuse(papers, {
      keys: [{ name: "subject_name", weight: 0.6 }, { name: "subject_code", weight: 0.4 }],
      threshold: 0.5, includeScore: false, minMatchCharLength: 2, ignoreLocation: true,
      findAllMatches: false, useExtendedSearch: false,
    });
  }, [papers]);

  const filteredPapers = useMemo(() => {
    const searchQuery = filters.searchQuery.trim();
    const needsFlattening = filters.type === "All" || !filters.type;
    const courseFilter = filters.course !== "All" ? filters.course : null;
    const semesterFilter = filters.semester || null;
    const subjectFilter = filters.subject !== "All" ? filters.subject : null;
    const typeFilter = filters.type !== "All" ? filters.type : null;
    const parsed = searchQuery ? parseSearchQuery(searchQuery) : null;
    const searchLower = searchQuery.toLowerCase();
    const useFuse = searchQuery && !parsed && searchQuery.length >= 4 && fuseInstance;
    let result: NormalizedPaper[] = [];
    const maxResults = searchQuery.length <= 2 ? 100 : Infinity;
    let count = 0;
    for (let i = 0; i < papers.length && count < maxResults; i++) {
      const p = papers[i];
      if (courseFilter && p.course !== courseFilter) continue;
      if (semesterFilter && p.semester !== semesterFilter) continue;
      if (subjectFilter && p.subject_name !== subjectFilter) continue;
      if (typeFilter) {
        if (typeFilter === "cop" && p.type !== "cop") continue;
        if (typeFilter === "exam" && p.type !== "exam") continue;
        if (typeFilter === "both" && p.type !== "both") continue;
      }
      if (searchQuery) {
        if (parsed) {
          if (parsed.subject && !fuzzyMatchSubject(p.subject_name, parsed.subject)) continue;
          if (parsed.semester && p.semester !== parsed.semester) continue;
        } else if (!useFuse) {
          const subject = p.subject_name || "";
          const code = p.subject_code || "";
          if (searchLower.length === 1) {
            if (subject.charAt(0).toLowerCase() !== searchLower && code.charAt(0).toLowerCase() !== searchLower) {
              if (!subject.toLowerCase().includes(searchLower) && !code.toLowerCase().includes(searchLower)) continue;
            }
          } else if (!subject.toLowerCase().includes(searchLower) && !code.toLowerCase().includes(searchLower)) {
            continue;
          }
        }
      }
      result.push(p);
      count++;
    }
    if (useFuse && result.length > 0 && result.length < 500) {
      const searchSet = result.length > 200 ? result.slice(0, 200) : result;
      const tf = new Fuse(searchSet, {
        keys: [{ name: "subject_name", weight: 0.7 }, { name: "subject_code", weight: 0.3 }],
        threshold: 0.7, includeScore: false, minMatchCharLength: 2, ignoreLocation: true, findAllMatches: false,
      });
      result = tf.search(searchQuery).map((r) => r.item);
    }
    if (needsFlattening) {
      if (searchQuery.length <= 2) {
        result = result.map((p) => ({
          ...p,
          paths: p.paths.length > 0 ? [p.paths[0]] : p.paths,
          path: p.paths[0]?.path || p.path,
          filename: p.paths[0]?.filename || p.filename,
          type: p.paths[0]?.type || p.type,
        }));
      } else {
        const flattened: NormalizedPaper[] = [];
        for (const p of result) {
          if (p.paths?.length > 0) {
            for (const ap of p.paths) flattened.push({ ...p, type: ap.type, paths: [ap], path: ap.path, filename: ap.filename });
          } else if (p.path) {
            flattened.push(p);
          }
        }
        result = flattened;
      }
    }
    const limit = searchQuery.length <= 2 ? 100 : Infinity;
    const toDisplay = limit < Infinity ? result.slice(0, limit) : result;
    return toDisplay.map((p, i) => toDisplayPaper(p, i));
  }, [papers, filters, fuseInstance]);

  const trendingPapers = useMemo(() => {
    const multi = papers.filter((p) => p.paths.length > 1);
    const recent = papers.filter((p) => parseInt(p.year.split("-")[0]) >= 2022).slice(0, 6);
    return [...multi, ...recent].slice(0, 6).map((p, i) => toDisplayPaper(p, i));
  }, [papers]);

  return {
    papers: filteredPapers,
    allPapers: papers.map((p, i) => toDisplayPaper(p, i)),
    filteredPapers,
    trendingPapers,
    filters,
    setFilters,
    clearFilters: () => setFilters({ course: "All", semester: null, subject: "All", type: "All", searchQuery: "" }),
    metadata,
    availableSubjects,
    availableSemesters,
    loading,
  };
};
