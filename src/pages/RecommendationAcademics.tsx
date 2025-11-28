import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { LaptopCard } from "@/components/LaptopCard";
import { mockLaptops } from "@/data/laptops";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const RecommendationAcademics = () => {
  const [uploaded, setUploaded] = useState(false);
  const [detectedSubjects, setDetectedSubjects] = useState<string[]>([]);

  const handleUpload = () => {
    // Simulate upload and parsing
    setUploaded(true);
    setDetectedSubjects([
      "Data Structures & Algorithms",
      "Machine Learning",
      "Computer Graphics",
      "Database Systems",
      "Web Development",
    ]);
  };

  // Mock recommendations based on detected subjects
  const recommendedLaptops = uploaded
    ? mockLaptops.filter(
        (l) =>
          l.suitableFor.includes("programming") ||
          l.suitableFor.includes("ml-dl") ||
          l.recommendedForBranches.includes("CSE")
      )
    : [];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Recommendations Based on Academics
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your 4-year curriculum to get personalized laptop suggestions
            that can handle all your coursework tools and software.
          </p>
        </div>

        {!uploaded ? (
          /* Upload Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-12 text-center border-dashed border-2 hover:border-primary/50 transition-colors">
              <div className="max-w-md mx-auto">
                <div className="inline-flex p-6 rounded-2xl gradient-card mb-6">
                  <Upload className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Upload Your Curriculum
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload your curriculum as a PDF or image. We'll analyze the
                  subjects and software requirements to recommend the best laptops.
                </p>
                <Button
                  onClick={handleUpload}
                  className="gradient-primary text-white shadow-button"
                  size="lg"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Upload Curriculum
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supports PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Detected Subjects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 gradient-card border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3">
                      Detected Key Subjects
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {detectedSubjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="px-3 py-1">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Based on these subjects, we recommend laptops with strong
                      processing power, good RAM, and dedicated graphics for ML/DL
                      work.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Recommended Laptops for Your Curriculum
                  </h2>
                  <p className="text-muted-foreground">
                    Sorted by best match for your academic needs
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setUploaded(false)}
                  size="sm"
                >
                  Upload Different File
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedLaptops.slice(0, 9).map((laptop, index) => (
                  <motion.div
                    key={laptop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative">
                      {index === 0 && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <Badge className="gradient-primary text-white shadow-button">
                            Top Pick
                          </Badge>
                        </div>
                      )}
                      <LaptopCard laptop={laptop} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationAcademics;
