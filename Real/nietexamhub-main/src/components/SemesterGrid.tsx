import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useExamPapers } from "@/hooks/useExamPapers";

const SemesterGrid = () => {
  const { metadata } = useExamPapers();
  const semesters = metadata.semesters || [];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Browse by Semester</h2>
      {semesters.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {semesters.map((sem, index) => (
            <motion.div
              key={sem}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/papers?semester=${sem}`}
                className="block bg-background border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Semester {sem}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">View papers</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No semesters available
        </div>
      )}
    </div>
  );
};

export default SemesterGrid;
