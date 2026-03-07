import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showHint?: boolean;
}

const SearchBar = ({ 
  value, 
  onChange,
  onKeyPress,
  placeholder = "Search by subject or subject:semester (e.g., 'cyber security', 'dsa:3')...",
  showHint = false
}: SearchBarProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="relative w-full"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10 flex items-center justify-center" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder={placeholder}
          className="pl-12 h-14 text-base bg-background border-border focus-visible:ring-primary rounded-xl shadow-sm"
        />
      </div>
      {showHint && (
        <div className="mt-2 text-xs text-muted-foreground italic">
          <strong>Examples:</strong> "dsa:3" | "data structures" | "cyber security"
        </div>
      )}
    </motion.div>
  );
};

export default SearchBar;
