import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, Info, FileText, Presentation, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMode, type Mode } from "@/contexts/ModeContext";
import ThemeToggle from "@/components/ThemeToggle";
import nietLogo from "@/assets/niet-logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode } = useMode();

  const prefix = mode === "ppt" ? "/ppt" : "/exam";

  const handleModeSwitch = (newMode: Mode) => {
    if (newMode === mode) return;
    setMode(newMode);

    // Auto sync the URL to match the new mode, replacing the category namespace
    const currentPath = location.pathname;
    const oldPrefix = newMode === "ppt" ? "/exam" : "/ppt";
    const newPrefix = newMode === "ppt" ? "/ppt" : "/exam";

    if (currentPath.startsWith(oldPrefix)) {
      navigate(currentPath.replace(oldPrefix, newPrefix));
    } else {
      navigate(`${newPrefix}/home`);
    }
  };

  const isActive = (path: string) => {
    const full = `${prefix}${path}`;
    return location.pathname === full;
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to={`${prefix}/home`}
          className="flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-foreground hover:text-primary transition-colors"
        >
          <img src={nietLogo} alt="NIET Logo" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {mode === "exam" ? "NIET Exam Hub" : "NIET PPT Hub"}
            </motion.span>
          </AnimatePresence>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            to={`${prefix}/home`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/home")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
          >
            Home
          </Link>
          <Link
            to={`${prefix}/search`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/search")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
          >
            {mode === "exam" ? "Papers" : "PPTs"}
          </Link>
          <Link
            to={`${prefix}/about`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${isActive("/about")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">About</span>
          </Link>
          <Link
            to={`${prefix}/bulk-download`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${isActive("/bulk-download")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Bulk</span>
          </Link>
          {mode === "ppt" && (
            <Link
              to="/ppt/upload"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${isActive("/upload")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Link>
          )}
        </nav>

        {/* Right side — mode switcher + theme toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex bg-muted/50 p-1 rounded-lg border border-border">
            <button
              onClick={() => handleModeSwitch("exam")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "exam"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <FileText className="h-4 w-4" />
              Exams
            </button>
            <button
              onClick={() => handleModeSwitch("ppt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "ppt"
                ? "bg-blue-500/10 text-blue-600 shadow-sm border border-blue-200/50"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Presentation className="h-4 w-4" />
              PPTs
            </button>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
