import { Link, useLocation } from "react-router-dom";
import { Download, Info } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-foreground hover:text-primary transition-colors">
          <img src="/niet-logo.png" alt="NIET Logo" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
          <span>NIET Exam Hub</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            Home
          </Link>
          <Link
            to="/papers"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/papers")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            Papers
          </Link>
          <Link
            to="/bulk-download"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive("/bulk-download")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Bulk</span>
          </Link>
          <Link
            to="/about"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive("/about")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">About</span>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
