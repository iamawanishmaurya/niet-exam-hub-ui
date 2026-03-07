import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import PaperCard from "@/components/PaperCard";
import { Button } from "@/components/ui/button";
import { useExamPapers } from "@/hooks/useExamPapers";
import { useMode } from "@/contexts/ModeContext";
import { Download, PackageCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DisplayPaper } from "@/types/examPaper";

const BulkDownload = () => {
  const { filteredPapers, filters, setFilters, clearFilters, loading } = useExamPapers();
  const { mode } = useMode();
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleToggleSelect = (paperId: string) => {
    setSelectedPapers((prev) => {
      const s = new Set(prev);
      s.has(paperId) ? s.delete(paperId) : s.add(paperId);
      return s;
    });
  };

  const handleSelectAll = () => {
    if (selectedPapers.size === filteredPapers.length) {
      setSelectedPapers(new Set());
    } else {
      setSelectedPapers(new Set(filteredPapers.map((p) => p.id)));
    }
  };

  const handleBulkDownload = () => {
    if (selectedPapers.size === 0) {
      toast({ title: "No papers selected", description: "Please select at least one paper to download.", variant: "destructive" });
      return;
    }
    const selected = filteredPapers.filter((p) => selectedPapers.has(p.id));
    const files: Array<{ href: string; filename: string }> = [];
    selected.forEach((paper) => {
      if (paper.paths?.length > 0) {
        paper.paths.forEach((path) => { if (path?.path) files.push({ href: path.path, filename: path.filename || "" }); });
      } else if (paper.primaryPath) {
        files.push({ href: paper.primaryPath, filename: paper.primaryFilename || "" });
      }
    });
    if (files.length === 0) {
      toast({ title: "No files to download", description: "Selected items don't have valid file paths.", variant: "destructive" });
      return;
    }
    if (files.length > 50 && !confirm(`This will start ${files.length} downloads. Continue?`)) return;
    toast({ title: "Download started", description: `Downloading ${files.length} files...` });
    let i = 0;
    const triggerNext = () => {
      if (i >= files.length) {
        toast({ title: "Downloads completed", description: `Successfully started ${files.length} downloads.` });
        setSelectedPapers(new Set());
        return;
      }
      const file = files[i++];
      const link = document.createElement("a");
      link.href = file.href;
      if (file.filename) link.download = file.filename;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(triggerNext, 150);
    };
    triggerNext();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading index...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedFiles = filteredPapers.filter((p) => selectedPapers.has(p.id)).reduce((acc, paper) => {
    return acc + (paper.paths.length > 0 ? paper.paths.length : paper.primaryPath ? 1 : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Bulk Download</h1>
          <p className="text-muted-foreground">Select multiple {mode === "exam" ? "papers" : "PPTs"} and download them all at once</p>
        </motion.div>

        <div className="mb-6">
          <SearchBar
            value={filters.searchQuery}
            onChange={(v) => setFilters({ ...filters, searchQuery: v })}
            placeholder={`Search ${mode === "exam" ? "papers" : "PPTs"} to add to bulk download...`}
          />
        </div>
        <div className="mb-6">
          <FilterPanel filters={filters} onFilterChange={setFilters} onClearFilters={clearFilters} />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="sticky top-20 z-40 bg-background/95 backdrop-blur border border-border rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PackageCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {selectedPapers.size} of {filteredPapers.length} selected{selectedFiles > 0 && ` (${selectedFiles} files)`}
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={handleSelectAll} className="flex-1 sm:flex-none border-border rounded-lg">
                {selectedPapers.size === filteredPapers.length ? "Deselect All" : "Select All"}
              </Button>
              <Button size="sm" onClick={handleBulkDownload} disabled={selectedPapers.size === 0}
                className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                <Download className="h-4 w-4 mr-1.5" />
                Download All ({selectedFiles || selectedPapers.size})
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} isSelected={selectedPapers.has(paper.id)}
                  onToggleSelect={handleToggleSelect} showCheckbox />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PackageCheck className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No items to select</h3>
              <p className="text-muted-foreground max-w-md">Try adjusting your search or filters.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BulkDownload;
