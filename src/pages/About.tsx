import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Github, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMode } from "@/contexts/ModeContext";
import { useExamPapers } from "@/hooks/useExamPapers";
import { appwriteConfig, databases } from "@/lib/appwrite";
import { Query } from "appwrite";

const About = () => {
  const { mode } = useMode();
  const { allPapers, loading } = useExamPapers();

  const [contributors, setContributors] = useState<string[]>([]);
  const [loadingContributors, setLoadingContributors] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.collectionId,
          [
            Query.select(["contributor"]),
            Query.notEqual("contributor", ""),
            Query.limit(100)
          ]
        );
        const names = new Set<string>();
        response.documents.forEach(doc => {
          if (doc.contributor && doc.contributor.trim() !== '') {
            names.add(doc.contributor.trim());
          }
        });
        setContributors(Array.from(names));
      } catch (err) {
        console.error("Failed to fetch contributors:", err);
      } finally {
        setLoadingContributors(false);
      }
    };
    fetchContributors();
  }, []);

  // Compute per-semester counts of actual PDF files
  const semesterCounts = allPapers.reduce<Record<string, number>>((acc, p) => {
    if (p.semester && p.paths && p.paths.length > 0) {
      acc[p.semester] = (acc[p.semester] || 0) + p.paths.length;
    } else if (p.semester) {
      acc[p.semester] = (acc[p.semester] || 0) + 1;
    }
    return acc;
  }, {});

  const totalFiles = Object.values(semesterCounts).reduce((a, b) => a + b, 0);

  const semesterOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const sortedSemesters = Object.keys(semesterCounts).sort(
    (a, b) => (semesterOrder.indexOf(a) ?? 99) - (semesterOrder.indexOf(b) ?? 99)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About NIET {mode === "exam" ? "Exam Hub" : "PPT Hub"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your one-stop solution for accessing, searching, and downloading {mode === "exam" ? "exam papers" : "study materials"} efficiently.
            </p>
          </div>

          {/* Resource counts grid */}
          {!loading && sortedSemesters.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                Available Resources
              </h2>

              <div className="mb-6 bg-primary/10 border border-primary/20 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
                <span className="text-5xl font-extrabold text-primary mb-2">{totalFiles}</span>
                <span className="text-lg font-semibold text-foreground mb-1">Total System Resources</span>
                <span className="text-sm text-muted-foreground">Across all semesters and subjects</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sortedSemesters.map((sem, i) => (
                  <motion.div
                    key={sem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all hover:bg-accent/30"
                  >
                    <span className="text-4xl font-bold text-primary/80 mb-2">{semesterCounts[sem]}</span>
                    <span className="text-sm font-semibold text-foreground mb-1">Semester {sem}</span>
                    <span className="text-xs text-muted-foreground">{mode === "exam" ? "Papers Available" : "PPTs Available"}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-background border border-border rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              NIET Exam Hub was created to make exam preparation easier for students. We understand the importance of having
              access to previous year papers and organized study materials.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform provides a clean, minimalist interface that lets you focus on what matters – finding and
              downloading the papers you need, quickly and efficiently.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Community Contributors</h2>
            <div className="bg-background border border-border rounded-xl p-8 mb-12">
              <p className="text-muted-foreground text-center mb-6">
                Special thanks to these amazing students who have contributed study materials to the platform!
              </p>
              {loadingContributors ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : contributors.length > 0 ? (
                <div className="flex flex-wrap gap-3 justify-center">
                  {contributors.map((name, i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="bg-accent/50 text-foreground px-4 py-2 rounded-full border border-border/50 font-medium flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-primary" />
                      {name}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground italic">No community contributors yet. Be the first to upload!</p>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Project Repository</h2>
            <div className="flex justify-center items-center">
              <motion.a href="https://github.com/Niet-College/niet-exam-hub-ui" target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                className="w-full sm:w-auto">
                <Button variant="default" size="lg" className="w-full sm:w-auto gap-2 transition-all">
                  <Github className="h-5 w-5" />
                  <span>Niet-College</span>
                </Button>
              </motion.a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Collaborators</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {[
                { name: "Awanish Kumar Maurya", href: "https://github.com/iamawanishmaurya" },
                { name: "Jai Saxena", href: "https://github.com/hello-jai" },
              ].map((c, i) => (
                <motion.a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 + i * 0.1 }}
                  className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto gap-2 transition-all hover:bg-accent">
                    <Github className="h-5 w-5" />
                    <span>{c.name}</span>
                  </Button>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">Built with ❤️ for students who want to study smarter, not harder.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
