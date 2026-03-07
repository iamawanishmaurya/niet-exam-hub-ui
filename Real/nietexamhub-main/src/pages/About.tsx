import { motion } from "framer-motion";
import Header from "@/components/Header";
import { BookOpen, Search, Download, Zap, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Fuzzy search algorithm finds papers even with typos or partial matches.",
  },
  {
    icon: Download,
    title: "Easy Downloads",
    description: "Download individual papers or bulk download multiple papers at once.",
  },
  {
    icon: Zap,
    title: "Fast Filters",
    description: "Filter by branch, semester, year, and exam type to find exactly what you need.",
  },
  {
    icon: BookOpen,
    title: "Organized Library",
    description: "Papers are well-organized and categorized for easy browsing.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About NIET Exam Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your one-stop solution for accessing, searching, and downloading exam papers
              efficiently.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-background border border-border rounded-xl p-8 mb-12"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              NIET Exam Hub was created to make exam preparation easier for students. We understand
              the importance of having access to previous year papers and organized study
              materials.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform provides a clean, minimalist interface that lets you focus on what
              matters – finding and downloading the papers you need, quickly and efficiently.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-background border border-border rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Collaborators
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="https://github.com/iamawanishmaurya"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto gap-2 hover:bg-accent transition-all"
                >
                  <Github className="h-5 w-5" />
                  <span>Awanish Kumar Maurya</span>
                </Button>
              </motion.a>
              <motion.a
                href="https://github.com/hello-jai"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto gap-2 hover:bg-accent transition-all"
                >
                  <Github className="h-5 w-5" />
                  <span>Jai Saxena</span>
                </Button>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Built with ❤️ for students who want to study smarter, not harder.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
