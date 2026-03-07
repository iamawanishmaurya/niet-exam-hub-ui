import { useEffect, useState, useDeferredValue, startTransition } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import PaperCard from "@/components/PaperCard";
import PdfPreviewModal from "@/components/PdfPreviewModal";
import { useExamPapers } from "@/hooks/useExamPapers";
import { FileQuestion, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Papers = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { filteredPapers, filters, setFilters, clearFilters, loading } = useExamPapers();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPath, setPreviewPath] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(filters.searchQuery);
  
  // Use deferred value to prioritize input responsiveness over filtering
  const deferredSearchInput = useDeferredValue(searchInput);

  // Only read from URL or location state on initial load, don't update it
  useEffect(() => {
    const semester = searchParams.get("semester");
    const search = searchParams.get("search");
    const initialSearch = (location.state as { initialSearch?: string })?.initialSearch;

    if (semester) {
      setFilters((prev) => ({ ...prev, semester }));
    }
    if (search) {
      setSearchInput(search);
      setFilters((prev) => ({ ...prev, searchQuery: search }));
    } else if (initialSearch) {
      // Use search from navigation state if available
      setSearchInput(initialSearch);
      setFilters((prev) => ({ ...prev, searchQuery: initialSearch }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update search filter using startTransition for non-blocking updates
  useEffect(() => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, searchQuery: deferredSearchInput }));
    });
  }, [deferredSearchInput, setFilters]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value); // Instant update - no delay!
  };

  const handlePreview = (path: string, title: string) => {
    setPreviewPath(path);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading PDF index...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PdfPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        pdfPath={previewPath}
        title={previewTitle}
      />

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Exam Papers</h1>
          <p className="text-muted-foreground">Browse and download exam papers</p>
        </motion.div>

        <div className="mb-6">
          <SearchBar
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Quick search: subject or subject:semester (e.g., 'cyber security', 'dsa:3')"
            showHint
          />
        </div>

        <div className="mb-6">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredPapers.length} {filteredPapers.length === 1 ? "paper" : "papers"} found
            </p>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => {
                if (value) setViewMode(value as "grid" | "list");
              }}
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid3x3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {filteredPapers.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {filteredPapers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No papers found</h3>
              <p className="text-muted-foreground max-w-md">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Papers;
