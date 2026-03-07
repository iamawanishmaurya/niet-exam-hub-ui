import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ModeProvider } from "@/contexts/ModeContext";
import NotFound from "./pages/NotFound";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Papers = lazy(() => import("./pages/Papers"));
const BulkDownload = lazy(() => import("./pages/BulkDownload"));
const About = lazy(() => import("./pages/About"));
const Upload = lazy(() => import("./pages/Upload"));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <ModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/exam/home" replace />} />

                {/* Exam routes */}
                <Route path="/exam/home" element={<Home />} />
                <Route path="/exam/search" element={<Papers />} />
                <Route path="/exam/bulk-download" element={<BulkDownload />} />
                <Route path="/exam/about" element={<About />} />

                {/* PPT routes */}
                <Route path="/ppt/home" element={<Home />} />
                <Route path="/ppt/search" element={<Papers />} />
                <Route path="/ppt/bulk-download" element={<BulkDownload />} />
                <Route path="/ppt/about" element={<About />} />
                <Route path="/ppt/upload" element={<Upload />} />

                {/* Legacy routes — redirect to exam */}
                <Route path="/papers" element={<Navigate to="/exam/search" replace />} />
                <Route path="/bulk-download" element={<Navigate to="/exam/bulk-download" replace />} />
                <Route path="/about" element={<Navigate to="/exam/about" replace />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ModeProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
