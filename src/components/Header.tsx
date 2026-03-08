import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, Info, FileText, Presentation, Upload, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMode, type Mode } from "@/contexts/ModeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import nietLogo from "@/assets/niet-logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode } = useMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const MobileNavLinks = () => (
    <div className="flex flex-col gap-4 mt-6">
      <Link
        to={`${prefix}/home`}
        onClick={() => setMobileMenuOpen(false)}
        className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive("/home")
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          }`}
      >
        Home
      </Link>
      <Link
        to={`${prefix}/search`}
        onClick={() => setMobileMenuOpen(false)}
        className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive("/search")
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          }`}
      >
        {mode === "exam" ? "Search Papers" : "Search PPTs"}
      </Link>
      <Link
        to={`${prefix}/about`}
        onClick={() => setMobileMenuOpen(false)}
        className={`px-4 py-3 rounded-lg text-base font-medium transition-all flex items-center gap-2 ${isActive("/about")
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          }`}
      >
        <Info className="h-5 w-5" />
        <span>About Hub</span>
      </Link>
      <Link
        to={`${prefix}/bulk-download`}
        onClick={() => setMobileMenuOpen(false)}
        className={`px-4 py-3 rounded-lg text-base font-medium transition-all flex items-center gap-2 ${isActive("/bulk-download")
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          }`}
      >
        <Download className="h-5 w-5" />
        <span>Bulk Download</span>
      </Link>
      {mode === "ppt" && (
        <Link
          to="/ppt/upload"
          onClick={() => setMobileMenuOpen(false)}
          className={`px-4 py-3 rounded-lg text-base font-medium transition-all flex items-center gap-2 ${isActive("/upload")
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
        >
          <Upload className="h-5 w-5" />
          <span>Upload PPT</span>
        </Link>
      )}
    </div>
  );

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

        {/* Desktop Nav links */}
        <nav className="hidden border-border md:flex items-center gap-1">
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
            <span>About</span>
          </Link>
          <Link
            to={`${prefix}/bulk-download`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${isActive("/bulk-download")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
          >
            <Download className="h-4 w-4" />
            <span>Bulk</span>
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
              <span>Upload</span>
            </Link>
          )}
        </nav>

        {/* Right side — mode switcher + theme toggle (Desktop) & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Desktop Mode Switcher (lg+) */}
          <div className="hidden lg:flex bg-muted/50 p-1 rounded-lg border border-border">
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

          {/* Mobile Mode Switcher — always visible on small screens */}
          <div className="flex lg:hidden bg-muted/50 p-0.5 rounded-lg border border-border">
            <button
              onClick={() => handleModeSwitch("exam")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "exam"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Exams</span>
            </button>
            <button
              onClick={() => handleModeSwitch("ppt")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "ppt"
                ? "bg-blue-500/10 text-blue-600 shadow-sm border border-blue-200/50"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>PPTs</span>
            </button>
          </div>

          <ThemeToggle />

          {/* Mobile Hamburger Menu */}
          <div className="flex md:hidden ml-1">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[350px]">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <img src={nietLogo} alt="NIET Logo" className="h-6 w-6" />
                    Navigation
                  </SheetTitle>
                  <SheetDescription>
                    Switch between modes or browse application features.
                  </SheetDescription>
                </SheetHeader>

                <div className="py-6 flex flex-col h-full">
                  {/* Mobile Mode Switcher - side by side */}
                  <div className="flex flex-row gap-2 p-1.5 bg-muted/50 rounded-xl border border-border">
                    <button
                      onClick={() => handleModeSwitch("exam")}
                      className={`flex flex-col items-center gap-1.5 p-3 flex-1 rounded-lg text-sm font-medium transition-all ${mode === "exam"
                        ? "bg-background shadow-md text-foreground border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <FileText className="h-5 w-5" />
                      Exams
                    </button>
                    <button
                      onClick={() => handleModeSwitch("ppt")}
                      className={`flex flex-col items-center gap-1.5 p-3 flex-1 rounded-lg text-sm font-medium transition-all ${mode === "ppt"
                        ? "bg-blue-500/10 text-blue-600 shadow-md border border-blue-200/50"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Presentation className="h-5 w-5" />
                      PPTs
                    </button>
                  </div>

                  <MobileNavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
