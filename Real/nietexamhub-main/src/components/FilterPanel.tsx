import { FilterOptions } from "@/types/examPaper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useExamPapers } from "@/hooks/useExamPapers";

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const FilterPanel = ({ filters, onFilterChange, onClearFilters }: FilterPanelProps) => {
  const { metadata, availableSubjects, availableSemesters } = useExamPapers();

  const handleCourseChange = (course: string) => {
    onFilterChange({
      ...filters,
      course,
      semester: null, // Reset semester when course changes
      subject: "All", // Reset subject when course changes
    });
  };

  const handleSemesterChange = (semester: string) => {
    onFilterChange({
      ...filters,
      semester: semester === "All" ? null : semester,
      subject: "All", // Reset subject when semester changes
    });
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full bg-background border border-border rounded-xl p-4 md:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-8 text-sm text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Course Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Course</label>
          <Select value={filters.course} onValueChange={handleCourseChange}>
            <SelectTrigger className="border-border rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Courses</SelectItem>
              {metadata.courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Semester</label>
          <Select
            value={filters.semester || "All"}
            onValueChange={handleSemesterChange}
          >
            <SelectTrigger className="border-border rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Semesters</SelectItem>
              {availableSemesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Subject</label>
          <Select
            value={filters.subject}
            onValueChange={(value) => onFilterChange({ ...filters, subject: value })}
          >
            <SelectTrigger className="border-border rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Subjects</SelectItem>
              {availableSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Type</label>
          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange({ ...filters, type: value })}
          >
            <SelectTrigger className="border-border rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="cop">COP</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;
