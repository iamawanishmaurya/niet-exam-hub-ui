import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SemesterGrid from "@/components/SemesterGrid";
import PaperCard from "@/components/PaperCard";
import RainEffect from "@/components/RainEffect";
import { useExamPapers } from "@/hooks/useExamPapers";
import { useMode } from "@/contexts/ModeContext";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const { filteredPapers, trendingPapers, loading, setFilters } = useExamPapers();
  const { mode, isTransitioning } = useMode();
  const [searchQuery, setSearchQuery] = useState("");

  const prefix = mode === "ppt" ? "/ppt" : "/exam";

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, [searchQuery, setFilters]);

  const handleViewAll = () => {
    navigate(`${prefix}/search`, { state: { initialSearch: searchQuery } });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) handleViewAll();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="min-h-screen bg-background relative">
      <RainEffect active={isTransitioning && mode === "ppt"} />
      <Header />

      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 tracking-tight">
            {mode === "exam" ? "NIET EXAM HUB" : "NIET PPT HUB"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {mode === "exam"
              ? "Search, filter, and download NIET exam papers and carry-over papers with ease. Fast, simple, organized."
              : "Browse and download study materials, presentations, and PPTs for all subjects."}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto mb-16">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onKeyPress={handleKeyPress}
            placeholder={
              mode === "exam"
                ? "Quick search: subject or subject:semester (e.g., 'cyber security', 'dsa:3')"
                : "Search PPTs: topic, subject, or unit (e.g., 'matrices', 'unit 1')"
            }
            showHint={mode === "exam" ? true : `"matrices" | "os unit 1" | "quantum computing"`}
          />
          {searchQuery.trim() && filteredPapers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <Button onClick={handleViewAll} className="w-full sm:w-auto" variant="outline">
                View All {filteredPapers.length} Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>

        {searchQuery.trim() && filteredPapers.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Search Results ({filteredPapers.length})</h2>
              <Button onClick={handleViewAll} variant="ghost" size="sm">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPapers.slice(0, 6).map((paper) => <PaperCard key={paper.id} paper={paper} />)}
            </div>
            {filteredPapers.length > 6 && (
              <div className="mt-6 text-center">
                <Button onClick={handleViewAll} variant="outline">View All {filteredPapers.length} Results <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            )}
          </motion.div>
        )}

        {searchQuery.trim() && filteredPapers.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No papers found for "{searchQuery}"</p>
            <Button onClick={() => setSearchQuery("")} variant="outline">Clear Search</Button>
          </motion.div>
        )}

        {!searchQuery.trim() && trendingPapers.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Trending {mode === "exam" ? "Papers" : "PPTs"}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingPapers.map((paper) => <PaperCard key={paper.id} paper={paper} />)}
            </div>
          </motion.div>
        )}

        {!searchQuery.trim() && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <SemesterGrid />
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;
